import { useNavigationContext } from '../../contexts/contextHooks';
import Loadable from '../../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from './ScriptListItem';
import { getPublicUser } from '../../api/users';
import { assertIsUserScriptSelectorScreen } from '../../navigation/screenChecks';
import Page from '../../components/Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api/apiHooks';
import { useMemo } from 'react';

const UserScriptSelectionPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsUserScriptSelectorScreen(currentScreen);

  const publicUserData = useAPICall(
    useMemo(
      () => () => getPublicUser(currentScreen.params.userId),
      [currentScreen],
    ),
  );

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
