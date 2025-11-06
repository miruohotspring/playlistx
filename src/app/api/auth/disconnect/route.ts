import { disconnectProvider } from '@src/server/services/providerService';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { options } from '../[...nextauth]/options';

export async function POST(request: Request) {
  const session = await getServerSession(options);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { provider } = await request.json();

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 },
      );
    }

    // アカウント連携解除のロジックを実行
    await disconnectProvider(session.user.id, provider);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting provider:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect provider' },
      { status: 500 },
    );
  }
}
