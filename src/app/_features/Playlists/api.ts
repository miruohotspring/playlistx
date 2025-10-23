'use server';

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { PLAYLISTS_TABLE } from '@lib/config';
import { docClient } from '@lib/dynamo';
import { v4 as uuidv4 } from 'uuid';
import type { Playlist } from '.';

/**
 * Fetch Session User Playlists
 * @param
 * @returns Array of session user's playlists
 */
export const fetchSessionUserPlaylists = async (): Promise<Playlist[]> => {
  return [];
  // const session = await getSession();
  // const user = session?.user;
  // if (!user || !user.email) {
  //   logger.error('User not authenticated');
  //   redirect('/api/auth/signIn');
  // }
  //
  // const command = new QueryCommand({
  //   TableName: PLAYLISTS_TABLE as string,
  //   IndexName: 'created_by_created_at_index',
  //   KeyConditionExpression: 'created_by = :uid',
  //   ExpressionAttributeValues: {
  //     ':uid': user,
  //   },
  //   ScanIndexForward: false,
  // });
  //
  // const result = await ddbDocClient.send(command);
  // const items = result.Items as Playlist[] | undefined;
  // return items ?? [];
};

/**
 * Fetch Playlist
 * @param id - playlist ID
 * @returns Playlist Detail
 */
export const fetchPlaylist = async (id: string): Promise<Playlist | null> => {
  console.log(id);
  return null;
  // const session = await getSession();
  // const userId = session?.userId;
  //
  // const result = await ddbDocClient.send(
  //   new GetCommand({
  //     TableName: PLAYLISTS_TABLE as string,
  //     Key: { id },
  //   }),
  // );
  //
  // const playlist = result.Item;
  // if (!playlist) return null;
  //
  // const items = result.Items as Playlist[] | undefined;
  // return items ?? [];
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
  // const session = await getSession();
  // const userId = session.userId;

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
    created_by: '',
    updated_by: '',
  };

  await docClient.send(
    new PutCommand({
      TableName: PLAYLISTS_TABLE,
      Item: newPlaylist,
    }),
  );

  return newPlaylist;
}
