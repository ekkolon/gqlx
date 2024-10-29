import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { json } from '@codemirror/lang-json';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { lineNumbers } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import {
  LucideAngularModule,
  LucideChevronDown,
  LucideChevronUp,
} from 'lucide-angular';

type ConfigTab = 'Variables' | 'Headers';

const coreExtensions = [
  syntaxHighlighting(oneDarkHighlightStyle),
  bracketMatching(),
  lineNumbers(),
  json(),
  basicSetup,
  oneDark,
];

export type ResponsePayload = string | object | undefined;

function formatJSON(response: ResponsePayload): string | undefined {
  if (response == null) return undefined;
  return JSON.stringify(response, null, 2);
}

@Component({
  selector: 'gqlx-query-config',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './query-config.component.html',
  styleUrl: './query-config.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gqlx-query-config',
    '[attr.data-state]': 'expansionState()',
  },
})
export class GqlxQueryConfigComponent {
  private readonly elementRef = inject(ElementRef);
  private view?: EditorView;

  readonly tabs: ConfigTab[] = ['Variables', 'Headers'];

  readonly activeTab = model<ConfigTab>();
  readonly expanded = model<boolean>();
  readonly tabContent = viewChild.required<ElementRef>('tabContent');

  readonly response = input<string | object | undefined>(undefined, {
    alias: 'response',
  });

  variables = '';
  headers = '';

  private readonly icons = {
    expand: LucideChevronUp,
    shrink: LucideChevronDown,
  };

  readonly expansionStateIcon = computed(() => {
    if (this.expanded()) return this.icons.shrink;
    return this.icons.expand;
  });

  readonly expansionState = computed(() => {
    const isExpanded = this.expanded();
    if (isExpanded) return 'expanded';
    return 'shrink';
  });
  readonly isDefaultExpansionState = computed(
    () => this.expansionState() === 'shrink',
  );

  private readonly responseChangeEffect = effect(() => {
    const response = this.response();
    this.updateState(response);
  });

  constructor() {
    afterNextRender(() => {
      const state = EditorState.create({
        doc: undefined,
        extensions: [...coreExtensions],
      });

      this.view = new EditorView({
        state: state,
        parent: this.tabContent().nativeElement,
      });
    });
  }

  selectTab(tab: ConfigTab): void {
    this.activeTab.set(tab);
    if (!this.expanded()) {
      this.expanded.set(true);
    }
  }

  toggleExpand() {
    const expanded = !this.expanded();
    this.expanded.set(expanded);
    if (!expanded) {
      this.activeTab.set(undefined);
    } else {
      if (this.activeTab() == null) {
        this.activeTab.set('Variables');
      }
    }
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
