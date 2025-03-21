'use server';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { Playlist } from '.';
import { getServerSession } from 'next-auth';
import { options } from '@api/auth/[...nextauth]/options';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Fetch User Playlists
 * @param userId
 * @returns Array of User's playlists
 */
export async function fetchUserPlaylists(): Promise<Playlist[]> {
  const session = await getServerSession(options);
  if (!session || !session.userId) {
    return [];
  }

  const userId = session.userId;

  const command = new QueryCommand({
    TableName: process.env.PLAYLISTS_TABLE as string,
    IndexName: 'created_by_created_at_index',
    KeyConditionExpression: 'created_by = :uid',
    ExpressionAttributeValues: {
      ':uid': userId,
    },
    ScanIndexForward: false,
  });

  const result = await ddbDocClient.send(command);
  const items = result.Items as Playlist[] | undefined;
  return items ?? [];
}
