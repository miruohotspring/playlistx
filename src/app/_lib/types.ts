declare global {
  interface Window {
    // biome-ignore lint: dashjs
    dashjs: any;
  }
}
export type Platform = 'spotify' | 'soundcloud';

export type Track = {
  id: number;
  title: string;
  artist: string;
  platform: Platform;
  url: string;
};
