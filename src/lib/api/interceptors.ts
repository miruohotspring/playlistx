export type RequestInterceptor = (
  url: string,
  init: RequestInit,
) =>
  | Promise<{ url: string; init: RequestInit }>
  | { url: string; init: RequestInit };

export type ResponseInterceptor = (
  response: Response,
) => Promise<Response> | Response;

export class HttpInterceptorManager {
  private reqInterceptors: RequestInterceptor[] = [];
  private resInterceptors: ResponseInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.reqInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.resInterceptors.push(interceptor);
  }

  async applyRequest(url: string, init: RequestInit) {
    let currentUrl = url;
    let currentInit = init;
    for (const cb of this.reqInterceptors) {
      const result = await cb(currentUrl, currentInit);
      currentUrl = result.url;
      currentInit = result.init;
    }
    return { url: currentUrl, init: currentInit };
  }

  async applyResponse(response: Response) {
    let res = response;
    for (const cb of this.resInterceptors) {
      res = await cb(res);
    }
    return res;
  }
}

// Helper: Attach Authorization header via provided token resolver
export function withAuthHeader(
  getToken: () =>
    | Promise<string | null | undefined>
    | string
    | null
    | undefined,
): RequestInterceptor {
  return async (url, init) => {
    const token = typeof getToken === 'function' ? await getToken() : getToken;
    if (!token) return { url, init };
    const headers = new Headers(init.headers ?? {});
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return { url, init: { ...init, headers } };
  };
}

// Helper: Handle 401 Unauthorized with a callback
export function onUnauthorized(
  handler: (response: Response) => Promise<void> | void,
): ResponseInterceptor {
  return async (response) => {
    if (response.status === 401) {
      await handler(response);
    }
    return response;
  };
}
