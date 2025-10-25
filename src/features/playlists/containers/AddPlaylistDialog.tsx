'use client';

import { LoadingButton } from '@components/ui';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@components/ui';
import Button from '@mui/material/Button';
import type * as React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { createPlaylist } from '../api';
import { PlaylistCreateDto } from '../schemas';

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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PlaylistFormInputs>();

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (data) => {
    const parsed = PlaylistCreateDto.safeParse(data);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue?.path?.[0] === 'name') {
        setError('name', { type: 'zod', message: issue.message });
      }
      return;
    }

    try {
      await createPlaylist(parsed.data);
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
            helperText={errors.name?.message || ''}
            {...register('name')}
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
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPlaylistDialog;
