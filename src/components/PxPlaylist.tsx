import { Avatar, Chip, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import ImageIcon from '@mui/icons-material/Image'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const PxTrackList: React.FC<PxTrackListProps> = ({
  tracks = []
}: PxTrackListProps) => {
  const listItems = tracks.map((track) =>
      <ListItem key={track.id}>
        <ListItemAvatar>
          <Avatar variant='square'>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={track.title} secondary={track.artist} />
        <Chip label={track.platform} />
        <IconButton edge="end" aria-label="menu">
          <MoreVertIcon />
        </IconButton>
      </ListItem>
  )
  return (
    <List sx={{ width: '100%', minWidth: 360, bgcolor: 'background.paper' }}>
      {listItems}
    </List>
  )
}

type PxTrackListProps = {
  tracks: Track[]
}

export default PxTrackList
