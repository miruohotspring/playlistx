import { Container } from '@mui/material'
import PxTrackList from './components/PxPlaylist'
import PxUrlField from './components/PxUrlField'
import { Track } from './interfaces/Track'
import { Platform } from './enums/Platform'

const tracks: Track[] = [
    {id: 1, title: '月読のダンス (Prod. takashima)', artist: '瀬戸海月 (CV: シスター・クレア), 電音部', platform: Platform.Spotify, url: 'https://open.spotify.com/intl-ja/track/0g9kTKEnZi5gy0wWa76n8H?si=646094313cc347ec'}
]

const App: React.FC = () => {
  return (
    <Container maxWidth='xl'>
      <PxUrlField />
      <PxTrackList tracks={tracks} />
    </Container>
  )
}

export default App
