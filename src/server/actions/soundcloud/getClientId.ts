'use server';
import { SC_ASSET_INDEX, SC_BASE_URL } from '@lib/config/env';

export async function getClientId() {
  const url = SC_BASE_URL;
  const index = SC_ASSET_INDEX;
  if (!url || Number.isNaN(index)) return undefined;

  const res = await fetch(url);
  if (res.ok) {
    const body = res.body;
    if (body !== null) {
      const html = await new Response(body).text();
      const scriptSrcRegex =
        /<script\s+[^>]*crossorigin[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;
      const urls = [];
      let match = scriptSrcRegex.exec(html);
      while (match !== null) {
        urls.push(match[1]);
        match = scriptSrcRegex.exec(html);
      }
      if (index < 0 || index >= urls.length) {
        return undefined;
      }
      const assetUrl = urls[index];
      return await parseClientId(assetUrl);
    }
  }
  return undefined;
}

const parseClientId = async (url: string) => {
  const res = await fetch(url);
  if (res.ok) {
    const body = res.body;
    if (body !== null) {
      const script = await new Response(body).text();
      const clientIdRegex = /client_id\s*=\s*([^\s,]+)["']/g;
      const clientIds = [];
      let match = clientIdRegex.exec(script);
      while (match !== null) {
        clientIds.push(match[1]);
        match = clientIdRegex.exec(script);
      }
      if (clientIds.length > 0) return clientIds[0];
    }
  }
  return undefined;
};
