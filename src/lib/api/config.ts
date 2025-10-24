export interface ApiConfig {
  baseUrl?: string;
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: '',
  timeoutMs: 8000,
  retryCount: 2,
  retryDelayMs: 200,
};
