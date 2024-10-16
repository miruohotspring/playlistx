import 'server-only';

import { HeaderLayout } from '@features/HeaderLayout';
import { Auth } from '@features/Auth';

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
