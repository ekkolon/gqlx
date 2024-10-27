import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GqlxEditorComponent } from '@gqlx/ui-editor';
import { GqlxResultViewComponent } from '@gqlx/ui-response-view';
import { GqlxSidebarComponent } from '@gqlx/ui-sidebar';

import { GqlxNavbarComponent } from '@gqlx/ui-navbar';
import blogQuery from './data/samples/blog/query';
import { BlogSchema } from './data/samples/blog/schema';

@Component({
  selector: 'gqlx-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GqlxEditorComponent,
    GqlxResultViewComponent,
    GqlxSidebarComponent,
    GqlxNavbarComponent,
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
  readonly sampleResponse = JSON.stringify(undefined, null, 2);
  readonly sampleSchema = BlogSchema;
  readonly sampleQuery = blogQuery;
}
