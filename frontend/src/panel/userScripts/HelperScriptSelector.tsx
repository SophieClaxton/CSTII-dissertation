import { useCallback, useEffect, useState } from 'react';
import { useNavigationContext } from '../contexts/contextHooks';
import { UserWithScripts } from '../models/API/User';
import { getUser } from '../api/users';
import APIResponse from '../models/API/APIResponse';
import Loadable from '../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from '../support/script_selection/ScriptListItem';
import UnpublishedScriptListItem from './UnpublishedScriptListItem';
import CreateUserDialog from './CreateUserDialog';
import Typography from '@mui/material/Typography/Typography';
import { Button, Container, ListSubheader } from '@mui/material';
import { createUnpublishedScript } from '../api/unpublishedScripts';
import { editorScreen } from '../navigation/screens';
import Page from '../components/Page';
import { useAPICall } from '../api/apiHooks';

const HelperScriptSelector = () => {
  const { goTo } = useNavigationContext();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const userData = useAPICall(
    useCallback((): Promise<APIResponse<UserWithScripts>> => {
      if (!userId) {
        return Promise.resolve({ status: 'Loading' });
      } else {
        return getUser(userId);
      }
    }, [userId]),
  );
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const storedData = await chrome.storage.local.get('userId');
      const storedUserId = Number(storedData['userId']);
      console.log(`Found userId: ${storedUserId}`);
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setOpenCreateUserDialog(true);
      }
    };
    if (!userId) {
      getUserId();
    }
  }, [userId]);

  return (
    <Page title={'Your Scripts'}>
      <Loadable
        response={userData}
        onLoad={(user) => (
          <Container maxWidth={'md'}>
            <Typography variant="subtitle2">Username: {user.name}</Typography>
            <div className="all-scripts-container">
              <List sx={{ width: '100%' }}>
                <ListSubheader>Published Scripts</ListSubheader>
                {user.scripts.map((script) => (
                  <ScriptListItem script={script} />
                ))}
              </List>
              <List sx={{ width: '100%' }}>
                <ListSubheader>Unpublished Scripts</ListSubheader>
                <Button
                  onClick={() => {
                    const createNewScript = async () => {
                      const response = await createUnpublishedScript(user.id);
                      if (response.status === 'Loaded') {
                        console.log('Created new script');
                        goTo(editorScreen(response.data.id));
                      } else {
                        console.log('Could not create new script');
                      }
                    };
                    createNewScript();
                  }}
                >
                  Create New Script
                </Button>
                {user.unpublished_scripts.map((script) => (
                  <UnpublishedScriptListItem script={script} />
                ))}
              </List>
            </div>
          </Container>
        )}
      />
      <CreateUserDialog
        open={openCreateUserDialog}
        setOpen={setOpenCreateUserDialog}
        setUserId={setUserId}
      />
    </Page>
  );
};

export default HelperScriptSelector;
