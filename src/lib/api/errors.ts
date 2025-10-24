export interface DomainError {
  code?: string;
  message: string;
  context?: string;
}

export interface ApiError {
  code?: string;
  message: string;
  status?: number;
  details?: unknown;
}

// Result type used across API calls (Ok/Err)
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError | DomainError };

export function toApiError(err: unknown): ApiError {
  if (typeof err === 'string') {
    return { code: 'unknown', message: err };
  }
  if (err instanceof Error) {
    return { code: 'error', message: err.message };
  }
  const e = err as { code?: string; message?: string } | null | undefined;
  return {
    code: e?.code ?? 'unknown',
    message: e?.message ?? 'Unknown error',
  };
}
