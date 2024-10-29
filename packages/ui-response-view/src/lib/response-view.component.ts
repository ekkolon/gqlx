import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
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

  readonly response = input<string>();

  constructor() {
    afterNextRender(() => {
      const state = EditorState.create({
        doc: this.response(),
        extensions: [...coreExtensions],
      });

      this.view = new EditorView({
        state: state,
        parent: this.elementRef.nativeElement,
      });
    });
  }
}
