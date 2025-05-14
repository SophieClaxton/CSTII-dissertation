import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import Website from '../../models/api/Website';
import User from '../../models/api/User';
import { useState } from 'react';
import { StateSetter } from '../../models/utilTypes';

interface WorkflowFilterDialogProps {
  open: boolean;
  setOpen: StateSetter<boolean>;
  websites: Website[];
  authors: User[];
  websiteFilters: Website[];
  setWebsiteFilters: StateSetter<Website[]>;
  authorFilters: User[];
  setAuthorFilters: StateSetter<User[]>;
}

const WorkflowFilterDialog: React.FC<WorkflowFilterDialogProps> = ({
  open,
  setOpen,
  websites,
  authors,
  websiteFilters,
  setWebsiteFilters,
  authorFilters,
  setAuthorFilters,
}) => {
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<User | null>(null);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle>Add Filter</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ marginTop: '0.5rem' }}>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
            <Autocomplete
              value={selectedWebsite}
              options={websites}
              getOptionLabel={(website) => website.url}
              renderInput={(params) => (
                <TextField {...params} label="Choose Website" />
              )}
              autoComplete={true}
              autoSelect={true}
              onChange={(_event, value) => setSelectedWebsite(value)}
              sx={{ width: '100%' }}
            />
            <Button
              onClick={() => {
                if (selectedWebsite) {
                  setWebsiteFilters([...websiteFilters, selectedWebsite]);
                  setSelectedWebsite(null);
                }
              }}
            >
              Add
            </Button>
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
            <Autocomplete
              value={selectedAuthor}
              options={authors}
              getOptionLabel={(author) => author.name}
              renderInput={(params) => (
                <TextField {...params} label="Choose Author" />
              )}
              autoComplete={true}
              autoSelect={true}
              onChange={(_event, value) => setSelectedAuthor(value)}
              sx={{ width: '100%' }}
            />
            <Button
              onClick={() => {
                if (selectedAuthor) {
                  setAuthorFilters([...authorFilters, selectedAuthor]);
                  setSelectedAuthor(null);
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkflowFilterDialog;
