import 'server-only';

import { HeaderLayout } from '@features/HeaderLayout';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderLayout>{children}</HeaderLayout>
    </>
  );
}
