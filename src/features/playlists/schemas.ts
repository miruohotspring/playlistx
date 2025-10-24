import { z } from 'zod';

// DTO for creating a playlist
export const PlaylistCreateDto = z.object({
  name: z.string(),
  description: z.string().optional(),
});

// DTO for updating a playlist
export const PlaylistUpdateDto = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export type PlaylistCreateDto = z.infer<typeof PlaylistCreateDto>;
export type PlaylistUpdateDto = z.infer<typeof PlaylistUpdateDto>;
