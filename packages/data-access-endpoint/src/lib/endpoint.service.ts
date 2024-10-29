import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql';
import { lastValueFrom, map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GqlxEndpointService {
  readonly httpClient = inject(HttpClient);
  readonly injector = inject(Injector);

  runIntrospectionQuery(
    endpoint: string,
  ): Observable<HttpResponse<{ data: IntrospectionQuery }>> {
    return this.httpClient
      .post<IntrospectionQuery>(
        endpoint,
        { query: getIntrospectionQuery() },
        { observe: 'response' },
      )
      .pipe(tap(console.log));
  }

  fetchSchema(endpoint: string): Observable<GraphQLSchema> {
    return this.runIntrospectionQuery(endpoint).pipe(
      map(({ body }) => {
        if (body == null) {
          throw new Error(
            'Failed to build client schema. Introspection query cannot be empty',
          );
        }
        return buildClientSchema(body['data']);
      }),
    );
  }

  async executeQuery(endpoint: string, queryString: string) {
    const body = { query: queryString };
    const query$ = this.httpClient.post(endpoint as string, body, {});
    const result = await lastValueFrom(query$);
    return result;
  }
}
