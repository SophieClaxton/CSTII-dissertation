import { useNavigationContext } from '../../contexts/contextHooks';
import Loadable from '../Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from '../../support_interface/script_selection/ScriptListItem';
import { getWebsite } from '../../api_temp/websites';
import { assertIsWebsiteScriptSelectorScreen } from '../../navigation/screenChecks';
import Page from '../Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api_temp/apiHooks';
import { useCallback } from 'react';

const ScriptSelectionByWebsitePage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsWebsiteScriptSelectorScreen(currentScreen);

  const websiteData = useAPICall(
    useCallback(
      () => getWebsite(currentScreen.params.websiteId),
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

export default ScriptSelectionByWebsitePage;
