// Feature API client for Playlists
// Client-side HTTP wrapper using shared lib/api

import { ApiClient } from '@lib/api/client';
import { createNextAuthClientInterceptors } from '@lib/api/interceptors.nextauth.client';
import {
  PlaylistCreateDto as PlaylistCreateDtoSchema,
  PlaylistSchema,
} from './schemas';
import type { Playlist } from './types';

const interceptors = createNextAuthClientInterceptors();
const api = new ApiClient(undefined, undefined, interceptors);

export async function fetchUserPlaylists(): Promise<Playlist[]> {
  // GET /api/playlists
  try {
    const res = await api.get<unknown>('/api/playlists');
    const parsed = Array.isArray(res)
      ? PlaylistSchema.array().safeParse(res)
      : ({ success: false } as const);

    if (parsed.success) return parsed.data as unknown as Playlist[];
    return [];
  } catch {
    // Return empty list on failure to avoid runtime errors in UI
    return [];
  }
}

export async function fetchPlaylist(id: string): Promise<Playlist | null> {
  // GET /api/playlists/:id
  try {
    const res = await api.get<unknown>(`/api/playlists/${id}`);
    const parsed = PlaylistSchema.safeParse(res);
    if (parsed.success) return parsed.data as unknown as Playlist;
    return null;
  } catch {
    return null;
  }
}

export async function createPlaylist(data: {
  name: string;
  description?: string;
}): Promise<Playlist> {
  // Validate request payload with Zod before sending
  const validated = PlaylistCreateDtoSchema.safeParse(data);
  if (!validated.success) {
    // Throw with first error message for simplicity; UI can map errors as needed
    const message = validated.error.errors[0]?.message ?? 'Invalid payload';
    throw new Error(message);
  }

  // POST /api/playlists
  const res = await api.post<unknown>('/api/playlists', validated.data);
  // Validate response shape
  const parsed = PlaylistSchema.safeParse(res);
  if (!parsed.success) {
    throw new Error('Invalid playlist response from server');
  }
  return parsed.data as unknown as Playlist;
}
