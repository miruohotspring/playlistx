// Feature API client for Playlists
// Client-side HTTP wrapper using shared lib/api

import ApiClient from '../../../lib/api/client';
import { createNextAuthClientInterceptors } from '../../../lib/api/interceptors.nextauth.client';
import type { Playlist } from '../types';

const interceptors = createNextAuthClientInterceptors();
const api = new ApiClient(undefined, undefined, interceptors);

export async function fetchUserPlaylists(): Promise<Playlist[]> {
  // GET /api/playlists
  try {
    const res = await api.get<unknown>('/api/playlists');
    if (Array.isArray(res)) return res as Playlist[];
    return [];
  } catch {
    // Return empty list on failure to avoid runtime errors in UI
    return [];
  }
}

export async function fetchPlaylist(id: string): Promise<Playlist | null> {
  // GET /api/playlists/:id
  try {
    const res =
      (await api.get<Playlist | null>(`/api/playlists/${id}`)) ?? null;
    return res;
  } catch {
    return null;
  }
}

export async function createPlaylist(data: {
  name: string;
  description: string;
}): Promise<Playlist> {
  // POST /api/playlists
  return api.post<Playlist>('/api/playlists', data);
}
