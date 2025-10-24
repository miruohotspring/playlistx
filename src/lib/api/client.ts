import type { ApiConfig } from './config';
import HttpClient from './http';
import type { HttpInterceptorManager } from './interceptors';

export class ApiClient {
  private http: HttpClient;

  constructor(
    baseUrl?: string,
    config?: ApiConfig,
    interceptors?: HttpInterceptorManager,
  ) {
    this.http = new HttpClient(baseUrl, config, interceptors);
  }

  get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.http.get<T>(path, headers);
  }

  post<T>(
    path: string,
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.http.post<T>(path, data, headers);
  }
}

export default ApiClient;
