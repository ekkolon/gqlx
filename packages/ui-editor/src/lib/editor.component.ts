import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
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
import { graphql, updateSchema } from 'cm6-graphql';
import { basicSetup, EditorView } from 'codemirror';
import { GraphQLSchema } from 'graphql';
import {
  LucideAngularModule,
  LucideCopy,
  LucidePlay,
  LucideStopCircle,
  LucideWandSparkles,
} from 'lucide-angular';

const coreExtensions = [
  bracketMatching(),
  closeBrackets(),
  history(),
  autocompletion(),
  lineNumbers(),
  syntaxHighlighting(oneDarkHighlightStyle),
  basicSetup,
  oneDark,
  keymap.of([...defaultKeymap, ...historyKeymap]), // Default key bindings
  keymap.of([indentWithTab]),
];

@Component({
  selector: 'gqlx-editor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gqlx-editor-view',
  },
})
export class GqlxEditorComponent {
  private readonly elementRef = inject(ElementRef);
  private view?: EditorView;

  /**
   * The GraphQL schema to render within the CodeMirror editor view.
   */
  readonly schema = input<GraphQLSchema>();

  /**
   * A string representing a predefined GraphQL query to load into the editor initially.
   */
  readonly query = input<string | undefined>(undefined, {});

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

  /**
   * Event emitted when a user explicitly initiates query execution.
   */
  protected readonly execute = output<void>();

  /**
   * Event emitted when a query is explicitly canceled by the user.
   */
  protected readonly canceled = output<void>();

  /**
   * Object containing icon components for various editor actions.
   */
  readonly icons = {
    execute: LucidePlay,
    stop: LucideStopCircle,
    pretty: LucideWandSparkles,
    copy: LucideCopy,
  };

  constructor() {
    afterNextRender(async () => {
      const state = await this.createEditorState();
      this.view = new EditorView({
        state: state,
        parent: this.elementRef.nativeElement,
      });
    });
  }

  /**
   * Emits an event to notify parent listeners to cancel the currently running query.
   * Only emits if a query is in progress (`isRunning` is `true`).
   */
  cancel() {
    if (this.isRunning()) {
      // Note: We perform this extra check here because, even though unlikely,
      // an actor creating this component dynamically may call this method and
      // potentially emit a `canceled` event for no query running.
      this.canceled.emit();
    }
  }

  /**
   * Updates the editor view with a specified GraphQL schema.
   * If `null` or `undefined` is provided, an *empty* editor view is rendered.
   *
   * @param schema An instance of {@link GraphQLSchema} to load into the editor,
   * or `null`/`undefined` to clear the current schema.
   */
  updateSchema(schema?: GraphQLSchema | null) {
    if (this.view) {
      if (schema == null) {
        updateSchema(this.view, undefined);
        return;
      }

      updateSchema(this.view, schema);
    }
  }

  private async createEditorState() {
    const schema = this.schema();
    const showErrorOnInvalidSchema = this.showErrorOnInvalidSchema();

    const graphqlFacet = graphql(schema, {
      showErrorOnInvalidSchema,
      autocompleteOptions: { mode: 'EXECUTABLE' as never },
      onShowInDocs(field, type, parentType) {
        // alert(
        //   `Showing in docs.: Field: ${field}, Type: ${type}, ParentType: ${parentType}`,
        // );
      },
      onFillAllFields(view, schema, _query, cursor, token) {
        // alert(`Filling all fields. Token: ${token}`);
      },
    });

    let query = this.query();
    if (query) {
      query = await formatGQL(query);
    }

    return EditorState.create({
      doc: query,
      extensions: [...coreExtensions, graphqlFacet],
    });
  }
}
