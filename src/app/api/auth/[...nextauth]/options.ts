import { DynamoDBAdapter } from '@lib/dynamodbAdapter';
import type { Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const options = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  adapter: DynamoDBAdapter,
  session: {
    strategy: 'database' as const,
  },
  callbacks: {
    async session({ session }: { session: Session }): Promise<Session> {
      if (session.sessionToken) {
        const dbSession = await DynamoDBAdapter.getSession(
          session.sessionToken,
        );
        if (dbSession) {
          session.expires = dbSession.expires;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user }: { user: User }): Promise<void> {
      const newUser: User = {
        id: user.id,
        name: user.name ?? '',
        email: user.email ?? '',
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image ?? undefined,
      };
      await DynamoDBAdapter.createUser(newUser);
    },
    async session({ session }: { session: Session }): Promise<void> {
      if (session.sessionToken && session.user) {
        const newSession: Session = {
          sessionToken: session.sessionToken,
          userId: session.user.id,
          expires: session.expires,
        };
        await DynamoDBAdapter.createSession(newSession);
      }
    },
  },
};
