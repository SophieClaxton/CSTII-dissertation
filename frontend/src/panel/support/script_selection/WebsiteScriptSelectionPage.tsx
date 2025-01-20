import { useNavigationContext } from '../../contexts/contextHooks';
import Loadable from '../../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from './ScriptListItem';
import { getWebsite } from '../../api/websites';
import { assertIsWebsiteScriptSelectorScreen } from '../../navigation/screenChecks';
import Page from '../../components/Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api/apiHooks';
import { useMemo } from 'react';

const UserScriptSelectionPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsWebsiteScriptSelectorScreen(currentScreen);

  const websiteData = useAPICall(
    useMemo(
      () => () => getWebsite(currentScreen.params.websiteId),
      [currentScreen],
    ),
  );

  return (
    <Loadable
      response={websiteData}
      onLoad={(website) => (
        <Page title={`Scripts for ${website.url}`}>
          <Stack sx={{ padding: '0.5rem' }}>
            <List>
              {website.scripts.map((script) => (
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
