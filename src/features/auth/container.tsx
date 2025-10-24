'use client';

import { signIn, useSession } from 'next-auth/react';
import { type ReactNode, useEffect } from 'react';

export const Auth = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      signIn();
      return;
    }
  });

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default Auth;
