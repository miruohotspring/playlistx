import { Platform } from "../enums/Platform"

export interface Track {
  id: number
  title: string
  artist: string
  platform: Platform
  url: string
}
