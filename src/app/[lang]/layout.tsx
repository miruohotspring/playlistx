import 'server-only';

import { dir } from 'i18next';
import { Providers } from '@features/Providers';

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  console.log(lang);
  return (
    <html lang={lang} dir={dir(lang)}>
      <head>
        <meta content="width=device-width, initial-scale=1.0" />
        <title>Playlistz</title>
      </head>
      <body>
        <main>
          <Providers lang={lang}>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
