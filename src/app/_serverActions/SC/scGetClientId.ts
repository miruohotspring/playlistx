'use server';

export default async function scGetClientId() {
  const url = process.env.SC_BASE_URL;
  const index = Number(process.env.SC_ASSET_INDEX);
  if (!url || !index) return undefined;

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
      const assetUrl = urls[index];
      return await getClientId(assetUrl);
    }
  }
  return undefined;
}

const getClientId = async (url: string) => {
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
