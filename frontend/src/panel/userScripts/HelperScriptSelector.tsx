import { useEffect, useState } from 'react';
import { useNavigationContext } from '../contexts/contextHooks';
import { UserWithScripts } from '../models/User';
import { getUser } from '../api/users';
import APIResponse from '../models/APIResponse';
import Loadable from '../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from '../support/script_selection/ScriptListItem';
import UnpublishedScriptListItem from './UnpublishedScriptListItem';
import CreateUserDialog from './CreateUserDialog';

const HelperScriptSelector = () => {
  const { goBack } = useNavigationContext();

  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [userData, setUserData] = useState<APIResponse<UserWithScripts>>({
    status: 'Loading',
  });

  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const storedData = await chrome.storage.local.get({ userId: undefined });
      const storedUserId = storedData.userId as number | undefined;
      console.log(`Foudn userId: ${storedUserId}`);
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setOpenCreateUserDialog(true);
      }
    };
    getUserId();
  }, [goBack]);

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) {
        return;
      }
      const response = await getUser(userId);
      setUserData(response);
    };
    getUserData();
  }, [userId]);

  return (
    <>
      <Loadable
        response={userData}
        onLoad={(user) => (
          <div className="script-selection-page page">
            <div className="page-title">
              <h1>Your Scripts</h1>
              <button className="back-button" onClick={goBack}>
                Back
              </button>
            </div>
            <div className="all-scripts-container">
              <List>
                {user.scripts.map((script) => (
                  <ScriptListItem script={script} />
                ))}
              </List>
              <List>
                {user.unpublishedScripts.map((script) => (
                  <UnpublishedScriptListItem script={script} />
                ))}
              </List>
            </div>
          </div>
        )}
      />
      <CreateUserDialog
        open={openCreateUserDialog}
        setOpen={setOpenCreateUserDialog}
        setUserId={setUserId}
      />
    </>
  );
};

export default HelperScriptSelector;
