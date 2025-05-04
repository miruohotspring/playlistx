'use server';

import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getServerSession } from 'next-auth';
import { options } from '@api/auth/[...nextauth]/options';
import { docClient } from '@lib/dynamo';
import { allProviders } from '@common/constants';
import type { ProviderType } from '@common/constants';

export interface LinkedProviderMeta {
  linked: boolean;
  providerUserName?: string;
  providerProfileUrl?: string;
}

export async function getLinkedProviders(): Promise<
  Record<ProviderType, LinkedProviderMeta>
> {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    throw new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const pk = `USER#${session.user.id}`;

  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: process.env.NEXTAUTH_TABLE as string,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':prefix': 'ACCOUNT#',
      },
      ProjectionExpression: 'provider, providerUserName, providerProfileUrl',
    }),
  );

  const linked = allProviders.reduce<Record<ProviderType, LinkedProviderMeta>>(
    (acc, prov) => {
      acc[prov] = { linked: false };
      return acc;
    },
    {} as Record<ProviderType, LinkedProviderMeta>,
  );

  if (Items) {
    for (const item of Items) {
      const prov = item.provider as ProviderType;
      linked[prov] = {
        linked: true,
        providerUserName: item.providerUserName,
        providerProfileUrl: item.providerProfileUrl,
      };
    }
  }

  return linked;
}
