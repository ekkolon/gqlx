import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { GqlxEndpointService } from '@gqlx/data-access-endpoint';
import { GqlxQueryEditorComponent } from '@gqlx/ui-query-editor';
import { GqlxEndpointInputComponent } from '@gqlx/ui-endpoint-input';
import { GqlxNavbarComponent } from '@gqlx/ui-navbar';
import { GqlxQueryConfigComponent } from '@gqlx/ui-query-config';
import { GqlxResultViewComponent } from '@gqlx/ui-response-view';
import { GqlxSidebarComponent } from '@gqlx/ui-sidebar';
import { ConnectionStatusKind } from '@gqlx/util-introspection';
import { buildClientSchema } from 'graphql';
import {
  LucideAngularModule,
  LucideCopy,
  LucideWandSparkles,
} from 'lucide-angular';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  lastValueFrom,
  map,
  share,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  selector: 'gqlx-root',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    GqlxQueryEditorComponent,
    GqlxResultViewComponent,
    GqlxSidebarComponent,
    GqlxNavbarComponent,
    GqlxEndpointInputComponent,
    GqlxQueryConfigComponent,
    LucideAngularModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gqlx-app',
  },
})
export class AppComponent {
  private readonly endpointService = inject(GqlxEndpointService);

  private readonly endpointSubject = new BehaviorSubject<string | null>(
    'http://localhost:8080/graphql',
  );

  readonly endpoint$ = this.endpointSubject.asObservable().pipe(
    filter((endpoint) => endpoint != null),
    distinctUntilChanged(),
    shareReplay(1),
  );

  readonly schema$ = this.endpoint$.pipe(
    tap(() => this.connectionStatus.set(ConnectionStatusKind.CONNECTING)),
    switchMap((endpoint) =>
      this.endpointService.runIntrospectionQuery(endpoint),
    ),
    catchError((error) => {
      this.connectionStatus.set(ConnectionStatusKind.DISCONNECTED);
      throw error;
    }),
    map((res) => buildClientSchema(res.body?.data as never)),
    tap(() => this.connectionStatus.set(ConnectionStatusKind.CONNECTED)),
    share(),
  );

  readonly connectionStatus = model(ConnectionStatusKind.UNKNOWN);
  readonly lastResponse = model<object>();

  readonly editor = viewChild(GqlxQueryEditorComponent);

  /**
   * Object containing icon components for various editor actions.
   */
  readonly icons = {
    pretty: LucideWandSparkles,
    copy: LucideCopy,
  };

  onEndpointChange(url: string | null) {
    console.log('New endpoint url: ', url);
  }

  async executeQuery() {
    const queryString = this.editor()?.getSnapshot();
    if (queryString == null) {
      return;
    }

    const query$ = this.endpoint$.pipe(
      take(1),
      switchMap((endpoint) =>
        this.endpointService.executeQuery(endpoint, queryString),
      ),
    );

    const response = await lastValueFrom(query$);
    this.lastResponse.set(response);
  }
}
