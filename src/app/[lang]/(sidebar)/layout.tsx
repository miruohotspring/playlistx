import 'server-only';

import { Auth } from '@features/Auth';
import { HeaderLayout } from '@features/HeaderLayout';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Auth>
        <HeaderLayout>{children}</HeaderLayout>
      </Auth>
    </>
  );
}
