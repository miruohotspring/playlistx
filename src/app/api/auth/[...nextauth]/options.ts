import GoogleProvider from 'next-auth/providers/google';

export const options = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      // biome-ignore lint/style/noNonNullAssertion: sokoninakereba
      clientId: process.env.GOOGLE_ID!,
      // biome-ignore lint/style/noNonNullAssertion: sokoninakereba
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
};
