import type { NextAuthOptions } from 'next-auth';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBAdapter } from '@auth/dynamodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDoc = DynamoDBDocument.from(ddbClient);

export const options: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  adapter: DynamoDBAdapter(ddbDoc, {
    tableName: 'playlistx-next-auth',
  }),
  session: {
    strategy: 'database',
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
