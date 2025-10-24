import { createPlaylist } from './api.ts';
import { fetchUserPlaylists } from './api/client.ts';
import type { Playlist } from './types.ts';

export type { Playlist };
export { fetchUserPlaylists, createPlaylist };
