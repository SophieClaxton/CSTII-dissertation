import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse from '../../models/API/APIResponse';
import Loadable from '../../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from './ScriptListItem';
import './styles/scriptSelectionPage.css';
import { getPublicUser } from '../../api/users';
import { PublicUserWithScripts } from '../../models/API/User';
import { assertIsUserScriptSelectorScreen } from '../../navigation/screenChecks';
import Page from '../../components/Page';
import Stack from '@mui/material/Stack/Stack';

const UserScriptSelectionPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsUserScriptSelectorScreen(currentScreen);

  const [publicUserData, setPublicUserData] = useState<
    APIResponse<PublicUserWithScripts>
  >({ status: 'Loading' });

  useEffect(() => {
    const getData = async () => {
      const response = await getPublicUser(currentScreen.params.userId);
      setPublicUserData(response);
    };
    getData();
  }, [currentScreen]);

  return (
    <Loadable
      response={publicUserData}
      onLoad={(user) => (
        <Page title={`${user.name}'s Scripts`}>
          <Stack sx={{ padding: '0.5rem' }}>
            <List>
              {user.scripts.map((script) => (
                <ScriptListItem script={script} />
              ))}
            </List>
          </Stack>
        </Page>
      )}
    />
  );
};

export default UserScriptSelectionPage;
