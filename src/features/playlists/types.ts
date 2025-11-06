export type Platform = 'spotify' | 'soundcloud';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover_image_url: string | null;
  is_collaborative: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  platform: Platform;
  url: string;
}
