// Feature API client for Settings
// This wraps Next.js API routes with a typed client using our shared lib/api layer.

import { ApiClient } from '@lib/api/client';
import { createNextAuthClientInterceptors } from '@lib/api/interceptors.nextauth.client';
import { DisconnectProviderDto } from './schemas';

const interceptors = createNextAuthClientInterceptors();
const api = new ApiClient(undefined, undefined, interceptors);

export async function disconnectProvider(provider: string): Promise<boolean> {
  // Validate provider before sending request
  const parsed = DisconnectProviderDto.safeParse({ provider });
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid provider';
    throw new Error(message);
  }

  // POST /api/auth/disconnect { provider }
  const res = await api.post<{ success?: boolean; error?: string }>(
    '/api/auth/disconnect',
    parsed.data,
  );
  return res?.success === true;
}
