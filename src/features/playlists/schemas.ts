import { z } from 'zod';

// DTO for creating a playlist
export const PlaylistCreateDto = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

// DTO for updating a playlist
export const PlaylistUpdateDto = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

// Schema for Playlist entity (API responses)
export const PlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  cover_image_url: z.string().nullable(),
  is_collaborative: z.boolean(),
  is_public: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string(),
  updated_by: z.string(),
});

export type PlaylistCreateDto = z.infer<typeof PlaylistCreateDto>;
export type PlaylistUpdateDto = z.infer<typeof PlaylistUpdateDto>;
export type Playlist = z.infer<typeof PlaylistSchema>;
