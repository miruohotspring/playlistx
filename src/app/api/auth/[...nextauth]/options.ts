import type { NextAuthOptions, Profile } from 'next-auth';
import { DynamoDBAdapter } from '@auth/dynamodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
import SoundCloudProvider, {} from '@lib/providers/soundcloud';
import type { SoundCloudProfile } from '@lib/providers/soundcloud';
import { ddbDocument, docClient } from '@lib/dynamo';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

interface GoogleProfile extends Profile {
  youtubeChannelTitle?: string;
  youtubeChannelUrl?: string;
}

const adapter = DynamoDBAdapter(ddbDocument, {
  tableName: process.env.NEXTAUTH_TABLE as string,
});

export const options: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      name: 'YouTube',
      authorization: {
        params: {
          scope:
            'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly',
        },
      },
      style: {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg',
        logoDark:
          'https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg',
        bg: '#fff',
        text: '#000',
      },
      userinfo: {
        url: 'https://openidconnect.googleapis.com/v1/userinfo',
        async request({ tokens }) {
          const userRes = await fetch(
            'https://openidconnect.googleapis.com/v1/userinfo',
            {
              headers: { Authorization: `Bearer ${tokens.access_token}` },
            },
          );
          const userJson = await userRes.json();
          const ytRes = await fetch(
            'https://youtube.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
            { headers: { Authorization: `Bearer ${tokens.access_token}` } },
          );
          const ytJson = await ytRes.json();
          const first = ytJson.items?.[0]?.snippet;
          const channelId = ytJson.items?.[0]?.id;

          return {
            ...userJson,
            youtubeChannelTitle: first?.title,
            youtubeChannelUrl:
              first && channelId
                ? `https://www.youtube.com/channel/${channelId}`
                : undefined,
          };
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          youtubeChannelTitle: profile.youtubeChannelTitle,
          youtubeChannelUrl: profile.youtubeChannelUrl,
        };
      },
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    }),
    SoundCloudProvider({
      clientId: process.env.SOUNDCLOUD_CLIENT_ID as string,
      clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET as string,
    }),
  ],
  adapter,
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
  events: {
    async linkAccount({ user, account, profile }) {
      console.log(user);
      console.log(account);
      console.log(profile);

      const pk = `USER#${user.id}`;
      const sk = `ACCOUNT#${account.provider}#${account.providerAccountId}`;

      let providerUserName: string | undefined;
      let providerProfileUrl: string | undefined;

      switch (account.provider) {
        case 'google':
          providerUserName = (profile as GoogleProfile).youtubeChannelTitle;
          providerProfileUrl = (profile as GoogleProfile).youtubeChannelUrl;
          break;

        case 'spotify':
          providerUserName = profile.name ?? 'unknown';
          providerProfileUrl = `https://open.spotify.com/user/${profile.id}`;
          break;

        case 'soundcloud':
          providerUserName = profile.name ?? 'unknown';
          providerProfileUrl = (profile as unknown as SoundCloudProfile)
            .permalink_url;
          break;
      }

      console.log(`name:${providerUserName}`);
      console.log(`url: ${providerProfileUrl}`);

      if (providerUserName || providerProfileUrl) {
        const updateExpr: string[] = [];
        const exprAttrVals: Record<string, string> = {};

        if (providerUserName) {
          updateExpr.push('providerUserName = :uname');
          exprAttrVals[':uname'] = providerUserName;
        }
        if (providerProfileUrl) {
          updateExpr.push('providerProfileUrl = :url');
          exprAttrVals[':url'] = providerProfileUrl;
        }

        try {
          await docClient.send(
            new UpdateCommand({
              TableName: process.env.NEXTAUTH_TABLE,
              Key: { pk, sk },
              UpdateExpression: `SET ${updateExpr.join(', ')}`,
              ExpressionAttributeValues: exprAttrVals,
            }),
          );
        } catch (err) {
          console.error(
            `Failed to save ${account.provider} metadata for user ${user.id}`,
            err,
          );
        }
      }
    },
  },
};
