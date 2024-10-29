import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ConnectionStatus,
  ConnectionStatusKind,
} from '@gqlx/util-introspection';
import {
  LucideAngularModule,
  LucidePlay,
  LucideStopCircle,
} from 'lucide-angular';
import { GqlxConnectionStatusIndicatorComponent } from './connection-status-indicator.component';

/**
 * Standalone component that allows users to input a GraphQL API endpoint URL and
 * view the current connection status to that endpoint.
 *
 * TODO: Fix `CTRL+Z` | `CTRL+Y` undo/redo commands not working on input element.
 *       The problem here is that the codemirror editor catches these bindings in the editor view only,
 *       preventing other focusable elements to perform the native `undo` | `redo` actions.
 */
@Component({
  selector: 'gqlx-endpoint-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GqlxConnectionStatusIndicatorComponent,
    LucideAngularModule,
  ],
  templateUrl: './endpoint-input.component.html',
  styleUrl: './endpoint-input.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GqlxEndpointInputComponent {
  /**
   * Model signal holding the URL of the GraphQL endpoint as input by the user.
   *
   * @default null
   */
  readonly endpoint = model<string | null>(null);

  /**
   * Reflects the current status of the GraphQL endpoint connection.
   *
   * @default ConnectionStatusKind.UNKNOWN
   */
  readonly connectionStatus = input<ConnectionStatus>(
    ConnectionStatusKind.UNKNOWN,
  );

  /**
   * Indicates whether a query is currently being executed.
   *
   * @default false
   */
  readonly isRunning = input<boolean>(false, { alias: 'running' });

  /**
   * Event emitted when a query should be executed.
   */
  readonly execute = output<void>();

  /**
   * Event emitted when an executed query should be canceled.
   */
  readonly canceled = output<void>();

  /**
   * Object containing icon components for various editor actions.
   */
  protected readonly icons = {
    execute: LucidePlay,
    stop: LucideStopCircle,
  };
}
