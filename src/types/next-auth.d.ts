// next-auth.d.ts
import type {
  Account as NextAuthAccount,
  Session as NextAuthSession,
  User as NextAuthUser,
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
