import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

/**
 * Enum representing the various states of the GraphQL endpoint connection.
 * Provides constants for `UNKNOWN`, `CONNECTING`, `CONNECTED`, and `DISCONNECTED` statuses.
 */
export enum ConnectionStatusKind {
  UNKNOWN = 'unknown',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

/**
 * Type alias for the connection status as lowercase strings. This type is derived from the
 * GqlxEndpointConnectionStatusKind enum, representing the possible endpoint status values.
 */
export type ConnectionStatus = Lowercase<keyof typeof ConnectionStatusKind>;

/**
 * Determines the connection status of the GraphQL endpoint based on the HTTP response.
 * @param response - The HttpResponse or HttpErrorResponse object returned from the HTTP call.
 * @returns A GqlxEndpointConnectionStatusKind indicating the current connection status.
 */
export function getConnectionStatusFromHttpResponse(
  response: HttpResponse<unknown> | HttpErrorResponse,
): ConnectionStatusKind {
  if (response instanceof HttpResponse) {
    if (response.ok) {
      return ConnectionStatusKind.CONNECTED;
    } else {
      return ConnectionStatusKind.DISCONNECTED;
    }
  } else if (response instanceof HttpErrorResponse) {
    // Check for common error statuses to determine specific connection states
    switch (response.status) {
      case 0:
        return ConnectionStatusKind.DISCONNECTED; // Network error or CORS issue
      case 408:
        return ConnectionStatusKind.CONNECTING; // Request timeout
      default:
        return ConnectionStatusKind.DISCONNECTED; // Other errors
    }
  }

  // If the response is neither HttpResponse nor HttpErrorResponse, status is unknown
  return ConnectionStatusKind.UNKNOWN;
}
