import './globals.css';
import { cookies } from 'next/headers';
import 'server-only';
import { ThemeRegistry } from '@features/Theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = cookies().get('Next-Locale')?.value ?? 'ja';

  return (
    <html lang={locale}>
      <head>
        <meta content="width=device-width, initial-scale=1.0" />
        <title>Playlistz</title>
      </head>
      <body>
        <main>
          <ThemeRegistry>{children}</ThemeRegistry>
        </main>
      </body>
    </html>
  );
}
