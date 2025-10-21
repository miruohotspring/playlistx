import { ICON_SOUNDCLOUD, ICON_SOUNDCLOUD_DARK } from '@lib/config';

import type {
  OAuthConfig,
  OAuthUserConfig,
  TokenEndpointHandler,
} from 'next-auth/providers/oauth';

export interface SoundCloudProfile {
  id: number;
  username: string;
  avatar_url: string;
  email?: string;
  permalink_url: string;
}

export default function SoundCloudProvider(
  options: OAuthUserConfig<SoundCloudProfile>,
): OAuthConfig<SoundCloudProfile> {
  return {
    id: 'soundcloud',
    name: 'SoundCloud',
    type: 'oauth',
    version: '2.0',
    checks: ['state'], // PKCE implementations are welcome :)

    authorization: {
      url: 'https://secure.soundcloud.com/authorize',
      params: {
        response_type: 'code',
        scope: 'non-expiring',
      },
    },

    token: {
      url: 'https://secure.soundcloud.com/oauth/token',
      async request({ provider, params }) {
        const form = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: provider.clientId as string,
          client_secret: provider.clientSecret as string,
          redirect_uri: provider.callbackUrl,
          code: params.code as string,
        });

        if (!provider.token || typeof provider.token === 'string') {
          throw new Error('Token endpoint handler is not configured correctly');
        }
        const { url: tokenUrl } = provider.token;
        const res = await fetch(tokenUrl as string, {
          method: 'POST',
          headers: {
            Accept: 'application/json; charset=utf-8',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: form.toString(),
        });

        const json = (await res.json()) as {
          access_token: string;
          refresh_token?: string;
          expires_in?: number;
          scope?: string;
        };

        const tokens = {
          access_token: json.access_token,
          refresh_token: json.refresh_token,
          expires_in: json.expires_in,
          scope: json.scope,
        };

        return { tokens };
      },
    } as TokenEndpointHandler,

    userinfo: {
      async request({ tokens }) {
        const res = await fetch('https://api.soundcloud.com/me', {
          headers: {
            Accept: 'application/json; charset=utf-8',
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });
        const profile = await res.json();
        return profile;
      },
    },

    profile(profile) {
      return {
        id: String(profile.id),
        name: profile.username,
        email: `soundcloud_${profile.id}@users.soundcloud.local`,
        image: profile.avatar_url,
        permalink_url: profile.permalink_url,
      };
    },

    style: {
      logo: ICON_SOUNDCLOUD,
      logoDark: ICON_SOUNDCLOUD_DARK,
      bg: '#ff7700',
      text: '#fff',
    },

    ...options,
  };
}
