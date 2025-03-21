// next-auth.d.ts
import type {
  User as NextAuthUser,
  Session as NextAuthSession,
  Account as NextAuthAccount,
} from 'next-auth';

declare module 'next-auth' {
  interface User extends NextAuthUser {
    id: string;
    name?: string;
    email: string;
    emailVerified: Date | null;
    image?: string;
  }

  interface Account extends NextAuthAccount {
    userId: string;
  }

  interface Session extends NextAuthSession {
    sessionToken: string;
    userId: string;
    expires: Date;
    user?: User;
  }
}
