import { Button, Grid, TextField } from "@mui/material"

type PxUrlFieldProps = {
  onClick?: (url: string) => void
}

const PxUrlField: React.FC<PxUrlFieldProps> = ({
  onClick = () => {}
}) => {

  const onClickHandler = (url: string) => () => {
    onClick(url)
  }

  return (
      <Grid container spacing={2} alignItems='center' sx={{mt:2}}>
      <Grid item xs={11}>
        <TextField fullWidth id="playlist-url" label="Enter track URL" variant='outlined' />
      </Grid>
      <Grid item xs={1} justifyItems="center">
        <Button size='large' variant="contained" onClick={onClickHandler('test')}>ADD</Button>
      </Grid>
      </Grid>
  )
}

export default PxUrlField
