export { HttpClient } from './http';
export { ApiClient } from './client';
export {
  HttpInterceptorManager,
  type RequestInterceptor,
  type ResponseInterceptor,
  withAuthHeader,
  onUnauthorized,
} from './interceptors';
export { createNextAuthClientInterceptors } from './interceptors.nextauth.client';
export { createNextAuthServerInterceptors } from './interceptors.nextauth.server';
export { DEFAULT_API_CONFIG, type ApiConfig } from './config';
export type { ApiError, DomainError, Result } from './errors';
export { toApiError } from './errors';
