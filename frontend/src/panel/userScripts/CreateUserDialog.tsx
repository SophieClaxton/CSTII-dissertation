import Dialog from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import { useState } from 'react';
import { createUser, getUsers } from '../api/users';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';
import { useAPICall } from '../api/apiHooks';
import { StateSetter } from '../models/utilTypes';

interface CreateUserDialogProps {
  open: boolean;
  setOpen: StateSetter<boolean>;
  setUserId: StateSetter<number | undefined>;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  setOpen,
  setUserId,
}) => {
  const [username, setUsername] = useState('');
  const currentUsersData = useAPICall(getUsers);
  const [helperText, setHelperText] = useState<string | undefined>(undefined);

  const errorWithChosenUsername = (
    username: string,
  ): { error: boolean; message: string } => {
    if (currentUsersData.status != 'Loaded') {
      return { error: true, message: 'Could not check uniqueness' };
    } else {
      const exists = currentUsersData.data
        .map((user) => user.name)
        .includes(username);
      return {
        error: exists,
        message: exists ? 'Username already chosen' : '',
      };
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle>Start Writing Scripts</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          To start writing scripts, you need a username so that your scripts can
          be attributed to you.
        </Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            const { error, message } = errorWithChosenUsername(
              event.target.value,
            );
            setHelperText(error ? message : undefined);
          }}
          helperText={helperText}
          error={!!helperText}
          sx={{ width: '100%' }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={username.length === 0 || !!helperText}
          onClick={() => {
            const createNewUser = async () => {
              const response = await createUser(username);
              if (response.status === 'Loaded') {
                setUserId(response.data.id);
                await chrome.storage.local.set({ userId: response.data.id });
                setOpen(false);
              } else {
                console.log('Failed to create new user');
              }
            };
            createNewUser();
          }}
        >
          Create
        </Button>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
