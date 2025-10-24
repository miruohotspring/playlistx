import 'server-only';

import { AppProviders } from '@providers/AppProviders';
import { dir } from 'i18next';

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang} dir={dir(lang)}>
      <head>
        <meta content="width=device-width, initial-scale=1.0" />
        <title>Playlistz</title>
      </head>
      <body>
        <main>
          <AppProviders lang={lang}>{children}</AppProviders>
        </main>
      </body>
    </html>
  );
}
