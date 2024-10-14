'use server';

export default async function scGetClientId() {
  const url = process.env.SC_BASE_URL;
  if (!url) return undefined;

  const res = await fetch(url);
  if (res.ok) {
    const body = res.body;
    if (body !== null) {
      // const text = await new Response(body).text();
      // return text;
      return 'this-is-client-id';
    }
  }
  return undefined;
}
