export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export interface ApiError {
  code?: string;
  message: string;
}
