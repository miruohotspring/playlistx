import { SessionProvider as SP } from 'next-auth/react';
import type { ReactNode } from 'react';

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  return <SP>{children}</SP>;
};
