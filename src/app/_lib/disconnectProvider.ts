// lib/disconnectProvider.ts
import { QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from './dynamo';

const TABLE_NAME = process.env.NEXTAUTH_TABLE as string;

export async function disconnectProvider(
  userId: string,
  provider: string,
): Promise<void> {
  const pk = `USER#${userId}`;
  const skPrefix = `ACCOUNT#${provider}#`;

  try {
    const { Items } = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':prefix': skPrefix,
        },
        ProjectionExpression: 'pk, sk',
      }),
    );

    if (!Items || Items.length === 0) {
      return;
    }

    await Promise.all(
      Items.map((item) =>
        docClient.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
              pk: item.pk,
              sk: item.sk,
            },
          }),
        ),
      ),
    );
  } catch (error) {
    console.error(`Error disconnecting ${provider} for user ${userId}:`, error);
    throw new Error(`Failed to disconnect ${provider}`);
  }
}
