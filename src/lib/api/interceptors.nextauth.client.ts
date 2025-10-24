import { getSession, signIn } from 'next-auth/react';
import {
  HttpInterceptorManager,
  onUnauthorized,
  withAuthHeader,
} from './interceptors';

interface MaybeAccessToken {
  accessToken?: string;
}

export async function resolveClientAccessToken(): Promise<string | null> {
  try {
    const session = await getSession();
    const maybe = session as unknown as MaybeAccessToken | null;
    return maybe?.accessToken ?? null;
  } catch {
    return null;
  }
}

export function createNextAuthClientInterceptors(): HttpInterceptorManager {
  const mgr = new HttpInterceptorManager();
  mgr.addRequestInterceptor(withAuthHeader(resolveClientAccessToken));
  mgr.addResponseInterceptor(
    onUnauthorized(async () => {
      // For client-side, redirect to sign-in on 401
      await signIn();
    }),
  );
  return mgr;
}
