'use server';

import { options } from '@api/auth/[...nextauth]/options';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { allProviders } from '@common/constants';
import type { ProviderType } from '@common/constants';
import { NEXTAUTH_TABLE } from '@lib/config/env';
import { docClient } from '@lib/auth/dynamo';
import { getServerSession } from 'next-auth';

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
      TableName: NEXTAUTH_TABLE,
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
