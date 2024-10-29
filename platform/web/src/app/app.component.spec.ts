/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GqlxEndpointService } from '@gqlx/data-access-endpoint';
import { ConnectionStatusKind } from '@gqlx/util-introspection';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';

// mock `GqlxEndpointService`
const mockGqlxEndpointService = {
  runIntrospectionQuery: jest.fn(),
  executeQuery: jest.fn(),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: GqlxEndpointService, useValue: mockGqlxEndpointService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the connection status to DISCONNECTED when the endpoint is changed', () => {
    const newUrl = 'http://new.com/graphql';
    (component as any).endpointSubject.next(newUrl);

    component.schema$.subscribe();

    expect(component.connectionStatus()).toEqual(
      ConnectionStatusKind.DISCONNECTED,
    );
    expect(mockGqlxEndpointService.runIntrospectionQuery).toHaveBeenCalledWith(
      newUrl,
    );
  });

  it('should handle successful introspection queries', async () => {
    const mockSchemaResponse = { body: { data: {} } };
    mockGqlxEndpointService.runIntrospectionQuery.mockReturnValue(
      of(mockSchemaResponse),
    );

    const schema$ = component.schema$;

    schema$.subscribe((schema) => {
      expect(schema).toBeDefined();
      expect(component.connectionStatus()).toEqual(
        ConnectionStatusKind.CONNECTED,
      );
    });

    (component as any).endpointSubject.next('http://test.com/graphql');
  });

  it('should handle errors during introspection queries', async () => {
    mockGqlxEndpointService.runIntrospectionQuery.mockReturnValue(
      throwError(() => new Error('Error fetching schema')),
    );

    const schema$ = component.schema$;

    schema$.subscribe({
      error: (error) => {
        expect(error).toBeDefined();
        expect(component.connectionStatus()).toEqual(
          ConnectionStatusKind.DISCONNECTED,
        );
      },
    });

    (component as any).endpointSubject.next('http://test.com/graphql');
  });

  it('should execute query and set last response', async () => {
    const queryString = 'query { test }';
    const mockResponse = { data: { test: 'success' } };
    mockGqlxEndpointService.executeQuery.mockReturnValue(of(mockResponse));
    jest
      .spyOn((component as any).editor(), 'getSnapshot')
      .mockReturnValue(queryString);

    await component.executeQuery();

    expect(mockGqlxEndpointService.executeQuery).toHaveBeenCalledWith(
      (component as any).endpointSubject.value,
      queryString,
    );
    expect(component.lastResponse()).toEqual(mockResponse);
  });
});
