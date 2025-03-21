'use client';

import type * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { createPlaylist } from '..';

interface PlaylistFormInputs {
  name: string;
  description: string;
}

interface AddPlaylistDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddPlaylistDialog: React.FC<AddPlaylistDialogProps> = ({
  open,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlaylistFormInputs>();

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (data) => {
    try {
      await createPlaylist(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Create New Playlist</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name ? 'Name is required' : ''}
            {...register('name', { required: true })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            {...register('description')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPlaylistDialog;
