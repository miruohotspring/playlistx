import type { ReactNode } from 'react';

export default function Page({
  params,
}: { params: { id: string } }): ReactNode {
  const { id } = params;
  return <>Playlist: {id}</>;
}
