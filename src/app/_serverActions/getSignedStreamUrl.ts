'use server';

import logger from '@common/logger';
import type { ActionResult } from './types';

export const getSignedStreamUrl = async (
  videoId: string,
): Promise<ActionResult<string>> => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/stream/${videoId}/token`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STREAM_TOKEN}`,
        'Content-Type': 'application/json', // 必要に応じてContent-Typeを指定
      },
    });

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();
    logger.debug(data);

    if (!data.success) {
      throw new Error();
    }

    return {
      success: true,
      data: `${process.env.STREAM_ENDPOINT}/${data.result.token}/manifest/video.mpd`,
    };
  } catch (e) {
    return {
      success: false,
      error: 'could not get token.',
    };
  }
};
