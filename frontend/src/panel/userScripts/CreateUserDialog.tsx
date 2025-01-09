import Dialog from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import { useEffect, useState } from 'react';
import APIResponse from '../models/APIResponse';
import User from '../models/User';
import { getUsers } from '../api/users';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setUserId: (value: number) => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  setOpen,
  setUserId,
}) => {
  const [username, setUsername] = useState('');
  const [currentUsersData, setCurrentUsersData] = useState<APIResponse<User[]>>(
    { status: 'Loading' },
  );
  const [helperText, setHelperText] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getCurrentUserData = async () => {
      const response = await getUsers();
      setCurrentUsersData(response);
    };
    getCurrentUserData();
  }, []);

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
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={username.length === 0 || !!helperText}
          onClick={() => {
            // const createUser
            setUserId(1);
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
