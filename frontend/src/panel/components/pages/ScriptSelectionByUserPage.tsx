import { useNavigationContext } from '../../contexts/contextHooks';
import Loadable from '../Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from '../../support_interface/script_selection/ScriptListItem';
import { getPublicUser } from '../../api_temp/users';
import { assertIsUserScriptSelectorScreen } from '../../navigation/screenChecks';
import Page from '../Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api_temp/apiHooks';
import { useCallback } from 'react';

const ScriptSelectionByUserPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsUserScriptSelectorScreen(currentScreen);

  const publicUserData = useAPICall(
    useCallback(
      () => getPublicUser(currentScreen.params.userId),
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

export default ScriptSelectionByUserPage;
