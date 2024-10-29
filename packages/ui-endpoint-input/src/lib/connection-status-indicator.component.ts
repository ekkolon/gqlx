import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { ConnectionStatus } from '@gqlx/util-introspection';

/**
 * Standalone component responsible for displaying the connection status to the GraphQL endpoint.
 */
@Component({
  standalone: true,
  imports: [NgClass],
  selector: 'gqlx-endpoint-connection-status-badge',
  template: `
    <div class="flex items-center justify-center">
      <div class="w-4 h-4 rounded-full badge"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'gqlx-endpoint-connection-status',
    '[attr.data-status]': 'status()',
  },
})
export class GqlxConnectionStatusIndicatorComponent {
  /**
   * Status input representing the current connection state to the endpoint.
   */
  readonly status = input.required<ConnectionStatus>();
}
