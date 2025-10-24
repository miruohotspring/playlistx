import 'server-only';
import { options } from '@api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import {
  HttpInterceptorManager,
  onUnauthorized,
  withAuthHeader,
} from './interceptors';

interface MaybeAccessToken {
  accessToken?: string;
}

export async function resolveServerAccessToken(): Promise<string | null> {
  try {
    const session = await getServerSession(options);
    const maybe = session as unknown as MaybeAccessToken | null;
    return maybe?.accessToken ?? null;
  } catch {
    return null;
  }
}

export function createNextAuthServerInterceptors(): HttpInterceptorManager {
  const mgr = new HttpInterceptorManager();
  mgr.addRequestInterceptor(withAuthHeader(resolveServerAccessToken));
  mgr.addResponseInterceptor(
    onUnauthorized(async () => {
      // In server context, let the caller handle the 401 by throwing or mapping error
      // No redirect here
    }),
  );
  return mgr;
}
