// Feature API client for Settings
// This wraps Next.js API routes with a typed client using our shared lib/api layer.

import ApiClient from '../../lib/api/client';
import { createNextAuthClientInterceptors } from '../../lib/api/interceptors.nextauth.client';

const interceptors = createNextAuthClientInterceptors();
const api = new ApiClient(undefined, undefined, interceptors);

export async function disconnectProvider(provider: string): Promise<boolean> {
  // POST /api/auth/disconnect { provider }
  const res = await api.post<{ success?: boolean; error?: string }>(
    '/api/auth/disconnect',
    { provider },
  );
  return res?.success === true;
}
