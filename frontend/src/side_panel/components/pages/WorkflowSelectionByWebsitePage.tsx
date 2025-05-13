import { useNavigationContext } from '../../contexts/contextHooks';
import Loadable from '../Loadable';
import List from '@mui/material/List/List';
import { getWebsite } from '../../api/websites';
import { assertIsWebsiteWorkflowSelectorScreen } from '../../navigation/screenChecks';
import Page from '../Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api/apiHooks';
import { useCallback } from 'react';
import WorkflowListItem from '../../interactive_support/task_workflow_selection/WorkflowListItem';

const WorkflowSelectionByWebsitePage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsWebsiteWorkflowSelectorScreen(currentScreen);

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
        <Page title={`Task Workflows for ${website.url}`}>
          <Stack sx={{ padding: '0.5rem' }}>
            <List>
              {website.scripts.map((script) => (
                <WorkflowListItem workflow={script} />
              ))}
            </List>
          </Stack>
        </Page>
      )}
    />
  );
};

export default WorkflowSelectionByWebsitePage;
