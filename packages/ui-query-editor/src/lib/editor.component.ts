import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { keymap, lineNumbers } from '@codemirror/view';
import { formatGQL } from '@gqlx/util-formatter';
import { completion, graphql, updateSchema } from 'cm6-graphql';
import { basicSetup, EditorView } from 'codemirror';
import { GraphQLSchema } from 'graphql';
import { LucideAngularModule } from 'lucide-angular';

const coreExtensions = [
  bracketMatching(),
  closeBrackets(),
  history(),
  autocompletion(),
  completion,
  lineNumbers(),
  syntaxHighlighting(oneDarkHighlightStyle),
  basicSetup,
  oneDark,
  keymap.of([...defaultKeymap, ...historyKeymap]),
  keymap.of([indentWithTab]),
];

@Component({
  selector: 'gqlx-query-editor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gqlx-query-editor',
  },
})
export class GqlxQueryEditorComponent {
  private readonly elementRef = inject(ElementRef);

  private view?: EditorView;

  /**
   * The GraphQL server endpoint to render within the CodeMirror editor view.
   */
  readonly endpoint = input<string | null>(null);

  /**
   * The GraphQL schema to render within the CodeMirror editor view.
   */
  readonly schema = input<GraphQLSchema | null>(null);

  /**
   * A string representing a predefined GraphQL query to load into the editor initially.
   */
  readonly query = input<string | undefined>('', {});

  /**
   * Indicates whether a query is currently being executed.
   * This input accepts a boolean and defaults to `false`.
   * Aliased as `running`.
   */
  readonly isRunning = input<boolean>(false, { alias: 'running' });

  /**
   * A boolean flag that, when `true`, displays an error if the provided schema is invalid.
   * Defaults to `false`.
   */
  readonly showErrorOnInvalidSchema = input<boolean>(false);

  private readonly schemaChangeEffect = effect(() => {
    const schema = this.schema();
    this.updateSchema(schema);
  });

  constructor() {
    afterNextRender(async () => {
      const state = await this.createEditorState();
      this.view = new EditorView({
        state: state,
        parent: this.elementRef.nativeElement,
      });
    });
  }

  getSnapshot() {
    return this.view?.state.doc.toString() ?? '';
  }

  async copy() {
    const doc = this.view?.state.doc.toString() ?? '';
    const formattedDoc = await formatGQL(doc);
  }

  async format() {
    const to = this.view?.state.doc.length;
    const doc = this.view?.state.doc.toString() ?? '';
    const formattedDoc = await formatGQL(doc);
    this.view?.dispatch({
      changes: {
        from: 0,
        to,
        insert: formattedDoc,
      },
    });
  }

  // Method to set a new document content
  setDocumentContent(newContent: string) {
    if (this.view) {
      const currentDocLength = this.view.state.doc.length;

      this.view.dispatch({
        changes: {
          from: 0,
          to: currentDocLength,
          insert: newContent,
        },
      });
    }
  }

  /**
   * Updates the editor view with a specified GraphQL schema.
   * If `null` or `undefined` is provided, an *empty* editor view is rendered.
   *
   * @param schema An instance of {@link GraphQLSchema} to load into the editor,
   * or `null`/`undefined` to clear the current schema.
   */
  private updateSchema(schema?: GraphQLSchema | null) {
    if (this.view) {
      if (schema == null) {
        updateSchema(this.view, undefined);
        return;
      }

      updateSchema(this.view, schema);
    }
  }

  private async createEditorState() {
    const showErrorOnInvalidSchema = this.showErrorOnInvalidSchema();
    const graphqlFacet = graphql(undefined, {
      showErrorOnInvalidSchema,
      autocompleteOptions: {
        mode: 'UNKNOWN' as never,
        uri: this.endpoint() ?? undefined,
      },
    });

    let query = this.query();
    if (query) {
      // Prepolutate editor view with user-specified query
      query = await formatGQL(query);
    }

    return EditorState.create({
      doc: query,
      extensions: [...coreExtensions, graphqlFacet],
    });
  }
}
