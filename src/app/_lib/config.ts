import 'server-only';
import { z } from 'zod';

const LogLevelEnum = z.enum([
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
]);

const envSchema = z.object({
  AWS_REGION: z.string().default('ap-northeast-1'),
  NEXTAUTH_TABLE: z.string().min(1),
  PLAYLISTS_TABLE: z.string().min(1),

  AUTH_SECRET: z.string().min(1),
  GOOGLE_ID: z.string().min(1),
  GOOGLE_SECRET: z.string().min(1),
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SOUNDCLOUD_CLIENT_ID: z.string().min(1),
  SOUNDCLOUD_CLIENT_SECRET: z.string().min(1),

  CF_ACCOUNT_ID: z.string().min(1),
  STREAM_TOKEN: z.string().min(1),
  STREAM_ENDPOINT: z.string().min(1),

  SC_BASE_URL: z.string().min(1),
  SC_ASSET_INDEX: z.coerce.number().int().nonnegative().default(0),

  LOG_LEVEL: LogLevelEnum.default('info'),
});

const parsed = envSchema.safeParse({
  AWS_REGION: process.env.AWS_REGION,
  NEXTAUTH_TABLE: process.env.NEXTAUTH_TABLE,
  PLAYLISTS_TABLE: process.env.PLAYLISTS_TABLE,
  AUTH_SECRET: process.env.AUTH_SECRET,
  GOOGLE_ID: process.env.GOOGLE_ID,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_CLIENT_SECRET: process.env.SOUNDCLOUD_CLIENT_SECRET,
  CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
  STREAM_TOKEN: process.env.STREAM_TOKEN,
  STREAM_ENDPOINT: process.env.STREAM_ENDPOINT,
  SC_BASE_URL: process.env.SC_BASE_URL,
  SC_ASSET_INDEX: process.env.SC_ASSET_INDEX,
  LOG_LEVEL: process.env.LOG_LEVEL,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
export const {
  AWS_REGION,
  NEXTAUTH_TABLE,
  PLAYLISTS_TABLE,
  AUTH_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_CLIENT_SECRET,
  CF_ACCOUNT_ID,
  STREAM_TOKEN,
  STREAM_ENDPOINT,
  SC_BASE_URL,
  SC_ASSET_INDEX,
  LOG_LEVEL,
} = env;
