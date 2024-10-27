import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  LucideAngularModule,
  LucideBoxes,
  LucideCommand,
  LucideHistory,
  LucideRefreshCcw,
  LucideSettings,
} from 'lucide-angular';

@Component({
  selector: 'gqlx-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gqlx-sidebar',
  },
})
export class GqlxSidebarComponent {
  readonly icons = {
    boxes: LucideBoxes,
    history: LucideHistory,
    settings: LucideSettings,
    shortcuts: LucideCommand,
    reload: LucideRefreshCcw,
  };
}
