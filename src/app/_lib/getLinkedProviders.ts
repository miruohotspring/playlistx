'use server';

import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from './dynamo';
import { allProviders } from '@common/contants';

export type LinkedProviders = Record<string, boolean>;

/**
 * Returns which providers are linked to current user
 * @param userId user.id
 */
export async function getLinkedProviders(
  userId: string,
): Promise<LinkedProviders> {
  const pk = `USER#${userId}`;

  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: process.env.NEXTAUTH_TABLE,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':prefix': 'ACCOUNT#',
      },
      ProjectionExpression: 'provider',
    }),
  );

  const linked: LinkedProviders = Object.fromEntries(
    allProviders.map((p) => [p, false]),
  );

  if (Items) {
    for (const item of Items) {
      const prov = item.provider as string;
      linked[prov] = true;
    }
  }

  return linked;
}
