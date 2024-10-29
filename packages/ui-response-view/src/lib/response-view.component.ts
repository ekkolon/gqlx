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
import { json } from '@codemirror/lang-json'; // Import JSON language support
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { lineNumbers } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';

const coreExtensions = [
  EditorState.readOnly.of(true),
  syntaxHighlighting(oneDarkHighlightStyle),
  bracketMatching(),
  lineNumbers(),
  json(),
  basicSetup,
  oneDark,
];

export type ResponsePayload = string | object | undefined;

// TODO: Use method from util-formatter lib
function formatJSON(response: ResponsePayload): string | undefined {
  if (response == null) return undefined;
  return JSON.stringify(response, null, 2);
}

@Component({
  selector: 'gqlx-response-view',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styleUrl: './response-view.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gqlx-result-view',
  },
})
export class GqlxResultViewComponent {
  private readonly elementRef = inject(ElementRef);
  private view?: EditorView;

  readonly response = input<string | object | undefined>(undefined);

  private readonly responseChangeEffect = effect(() => {
    const response = this.response();
    this.updateState(response);
  });

  constructor() {
    afterNextRender(() => {
      const res = this.response();
      const formattedDoc = formatJSON(res);
      const state = EditorState.create({
        doc: formattedDoc,
        extensions: [...coreExtensions],
      });

      this.view = new EditorView({
        state: state,
        parent: this.elementRef.nativeElement,
      });
    });
  }

  private async updateState(response: ResponsePayload) {
    const to = this.view?.state.doc.length;
    const formattedDoc = formatJSON(response);
    this.view?.dispatch({
      changes: {
        from: 0,
        to,
        insert: formattedDoc,
      },
    });
  }
}
