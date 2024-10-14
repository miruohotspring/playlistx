import type { Session } from 'next-auth';
import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

export const options = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token }: { token: JWT; user: User }) {
      console.log('jwt callback');
      return token;
    },
    async session({ session }: { session: Session; token: JWT }) {
      console.log('session callback');
      return session;
    },
  },
  providers: [GoogleProvider({})],
};
