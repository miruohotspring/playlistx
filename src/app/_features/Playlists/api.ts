'use server';

import { options } from '@api/auth/[...nextauth]/options';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import logger from '@common/logger';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import type { Playlist } from '.';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const PLAYLISTS_TABLE = process.env.PLAYLISTS_TABLE as string;

/**
 * Fetch User Playlists
 * @param userId
 * @returns Array of User's playlists
 */
export const fetchUserPlaylists = async (): Promise<Playlist[]> => {
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
};

/**
 * Create Playlist
 * @param data
 * @returns Created Playlist
 */
export async function createPlaylist(data: {
  name: string;
  description: string;
}): Promise<Playlist> {
  const session = await getServerSession(options);
  if (!session || !session.userId) {
    logger.error(session);
    throw new Error('User is not authenticated');
  }
  const userId = session.userId;

  const now = new Date().toISOString();

  const newPlaylist: Playlist = {
    id: uuidv4(),
    name: data.name,
    description: data.description,
    cover_image_url: null,
    is_collaborative: false,
    is_public: false,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
  };

  await ddbDocClient.send(
    new PutCommand({
      TableName: PLAYLISTS_TABLE,
      Item: newPlaylist,
    }),
  );

  return newPlaylist;
}
