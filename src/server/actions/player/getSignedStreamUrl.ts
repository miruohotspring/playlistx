'use server';

import logger from '@lib/utils/logger';
import { CF_ACCOUNT_ID, STREAM_ENDPOINT, STREAM_TOKEN } from '@lib/config/env';
import type { ActionResult } from '../types';

export const getSignedStreamUrl = async (
  videoId: string,
): Promise<ActionResult<string>> => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${videoId}/token`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STREAM_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Cloudflare Stream token API returned non-OK response');
    }

    const data = await response.json();
    logger.debug(data);

    if (!data.success) {
      throw new Error(
        'Cloudflare Stream token API responded with success=false',
      );
    }

    return {
      success: true,
      data: `${STREAM_ENDPOINT}/${data.result.token}/manifest/video.mpd`,
    };
  } catch (e) {
    return {
      success: false,
      error: 'could not get token.',
    };
  }
};
