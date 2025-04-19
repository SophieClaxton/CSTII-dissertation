import { useCallback, useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import { getUser } from '../../api_temp/users';
import APIResponse from '../../models/api/APIResponse';
import Loadable from '../Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from '../../support_interface/script_selection/ScriptListItem';
import UnpublishedScriptListItem from '../../scripting_interface/user_scripts/UnpublishedScriptListItem';
import CreateUserDialog from '../../scripting_interface/user_scripts/CreateUserDialog';
import Typography from '@mui/material/Typography/Typography';
import { Button, Container, ListSubheader } from '@mui/material';
import { createUnpublishedScript } from '../../api_temp/unpublishedScripts';
import { editorScreen } from '../../navigation/screens';
import Page from '../Page';
import { useAPICall } from '../../api_temp/apiHooks';
import { UserWithScripts } from '../../models/api/User';

const UserScriptSelectorPage = () => {
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
                <ListSubheader>Unpublished Scripts</ListSubheader>
                <Button
                  variant={'outlined'}
                  sx={{ marginBottom: '0.5rem' }}
                  fullWidth
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
              <List sx={{ width: '100%' }}>
                <ListSubheader>Published Scripts</ListSubheader>
                {user.scripts.map((script) => (
                  <ScriptListItem script={script} />
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

export default UserScriptSelectorPage;
