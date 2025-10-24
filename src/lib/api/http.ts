export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

import { type ApiConfig, DEFAULT_API_CONFIG } from './config';
import type { HttpInterceptorManager } from './interceptors';

export class HttpClient {
  private baseUrl: string;
  private timeoutMs: number;
  private retryCount: number;
  private retryDelayMs: number;
  private interceptors?: HttpInterceptorManager;
  private etags = new Map<string, string>();
  private cache = new Map<string, unknown>();

  constructor(
    baseUrl?: string,
    config?: ApiConfig,
    interceptors?: HttpInterceptorManager,
  ) {
    this.baseUrl = baseUrl ?? '';
    this.timeoutMs = config?.timeoutMs ?? DEFAULT_API_CONFIG.timeoutMs ?? 8000;
    this.retryCount = config?.retryCount ?? DEFAULT_API_CONFIG.retryCount ?? 0;
    this.retryDelayMs =
      config?.retryDelayMs ?? DEFAULT_API_CONFIG.retryDelayMs ?? 0;
    this.interceptors = interceptors;
  }

  private key(method: HttpMethod, url: string) {
    return `${method}:${url}`;
  }

  private wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async request<T>(
    path: string,
    method: HttpMethod = 'GET',
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    let url = this.baseUrl ? `${this.baseUrl}${path}` : path;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      let init: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(headers ?? {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      };

      // ETag: If-None-Match for GET
      if (method === 'GET') {
        const key = this.key(method, url);
        const etag = this.etags.get(key);
        if (etag) {
          (init.headers as Record<string, string>)['If-None-Match'] = etag;
        }
      }

      // Apply request interceptors
      if (this.interceptors) {
        const applied = await this.interceptors.applyRequest(url, init);
        url = applied.url;
        init = applied.init;
      }

      let lastError: unknown;
      for (let attempt = 0; attempt <= this.retryCount; attempt++) {
        try {
          let res = await fetch(url, init);

          // Apply response interceptors
          if (this.interceptors) {
            res = await this.interceptors.applyResponse(res);
          }

          // Handle 304 Not Modified for GET
          if (res.status === 304 && method === 'GET') {
            const key = this.key(method, url);
            if (this.cache.has(key)) {
              return this.cache.get(key) as T;
            }
          }

          if (!res.ok) {
            const retryable =
              res.status === 429 || (res.status >= 500 && res.status <= 599);
            if (retryable && attempt < this.retryCount) {
              const delay = this.retryDelayMs * 2 ** attempt;
              await this.wait(delay);
              continue;
            }
            const text = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
          }

          const json = (await res.json()) as T;

          // Store ETag and cache for GET
          if (method === 'GET') {
            const key = this.key(method, url);
            const etag =
              res.headers.get('ETag') ??
              res.headers.get('Etag') ??
              res.headers.get('etag');
            if (etag) {
              this.etags.set(key, etag);
              this.cache.set(key, json as unknown);
            }
          }

          return json;
        } catch (err) {
          lastError = err;
          if (attempt < this.retryCount) {
            const delay = this.retryDelayMs * 2 ** attempt;
            await this.wait(delay);
            continue;
          }
          throw err;
        }
      }

      throw lastError ?? new Error('Unknown HTTP error');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, 'GET', undefined, headers);
  }

  post<T>(
    path: string,
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(path, 'POST', data, headers);
  }
}

export default HttpClient;
