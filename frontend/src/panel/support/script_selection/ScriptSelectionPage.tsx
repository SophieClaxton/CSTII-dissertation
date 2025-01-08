import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import '../../panel.css';
import APIResponse from '../../models/APIResponse';
import { ScriptWithAuthorAndWebsite } from '../../models/Script';
import { getScripts } from '../../api/scripts';
import ScriptListItem from './ScriptListItem';
import './styles/scriptSelectionPage.css';
import List from '@mui/material/List/List';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import Website from '../../models/Website';
import User from '../../models/User';
import { getWebsites } from '../../api/websites';
import { getUsers } from '../../api/users';

const ScriptSelectionPage: React.FC = () => {
  const { removeCurrentScreen } = useNavigationContext();
  const [scriptsData, setScriptsData] = useState<
    APIResponse<ScriptWithAuthorAndWebsite[]>
  >({ status: 'Loading' });
  const [scripts, setScripts] = useState<ScriptWithAuthorAndWebsite[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [authors, setAuthors] = useState<User[]>([]);
  console.log(websites);

  useEffect(() => {
    const getData = async () => {
      const scriptResponse = await getScripts();
      setScriptsData(scriptResponse);
      if (scriptResponse.status === 'Loaded') {
        setScripts(scriptResponse.data);
      }

      const websitesResponse = await getWebsites();
      if (websitesResponse.status == 'Loaded') {
        setWebsites(websitesResponse.data);
      }

      const usersRespose = await getUsers();
      if (usersRespose.status == 'Loaded') {
        setAuthors(usersRespose.data);
      }
    };
    getData();
  }, []);

  const [websiteFilters, setWebsiteFilters] = useState<Website[]>([]);
  const [authorFilters, setAuthorFilters] = useState<User[]>([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    if (scriptsData.status != 'Loaded') {
      return;
    }
    if (websiteFilters.length > 0 || authorFilters.length > 0) {
      setScripts(
        scriptsData.data.filter(
          (script) =>
            websiteFilters
              .map((website) => website.id)
              .includes(script.website.id) ||
            authorFilters.map((author) => author.id).includes(script.author.id),
        ),
      );
    } else {
      setScripts(scriptsData.data);
    }
  }, [scriptsData, websiteFilters, authorFilters]);

  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<User | null>(null);

  const scriptsContent =
    scriptsData.status === 'Loading' ? (
      <div>Loading...</div>
    ) : scriptsData.status === 'Error' ? (
      <div>{scriptsData.error.message}</div>
    ) : (
      <>
        <Stack direction={'row'} spacing={1} sx={{ width: '100%' }}>
          <Button onClick={() => setOpenFilterDialog(true)} variant="contained">
            Filters
          </Button>
          {websiteFilters.map((website) => (
            <Chip
              key={`W${website.id}`}
              label={website.url}
              onDelete={() => {
                const newWebsiteFilters = websiteFilters.filter(
                  (other) => other.id != website.id,
                );
                setWebsiteFilters(newWebsiteFilters);
              }}
            />
          ))}
          {authorFilters.map((author) => (
            <Chip
              key={`U${author.id}`}
              label={author.name}
              onDelete={() => {
                const newAuthorFilters = authorFilters.filter(
                  (other) => other.id != author.id,
                );
                setAuthorFilters(newAuthorFilters);
              }}
            />
          ))}
        </Stack>
        <List className="script-list">
          {scripts.map((script) => (
            <ScriptListItem script={script} />
          ))}
        </List>
      </>
    );

  return (
    <div className="script-selection-page page">
      <div className="page-title">
        <h1>Select a Script</h1>
        <button className="back-button" onClick={removeCurrentScreen}>
          Back
        </button>
      </div>
      <div className="all-scripts-container">{scriptsContent}</div>
      <Dialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        fullWidth={true}
        maxWidth={'sm'}
      >
        <DialogTitle>Add Filter</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ marginTop: '0.5rem' }}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              spacing={2}
            >
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
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              spacing={2}
            >
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
          <Button onClick={() => setOpenFilterDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScriptSelectionPage;
