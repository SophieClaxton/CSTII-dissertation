import { useNavigationContext } from '../../contexts/contextHooks';
import Loadable from '../Loadable';
import List from '@mui/material/List/List';
import { getPublicUser } from '../../api/users';
import { assertIsUserWorkflowSelectorScreen } from '../../navigation/screenChecks';
import Page from '../Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api/apiHooks';
import { useCallback } from 'react';
import WorkflowListItem from '../../interactive_support/task_workflow_selection/WorkflowListItem';

const WorkflowSelectionByUserPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsUserWorkflowSelectorScreen(currentScreen);

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
        <Page title={`${user.name}'s Task Workflows`}>
          <Stack sx={{ padding: '0.5rem' }}>
            <List>
              {user.scripts.map((script) => (
                <WorkflowListItem workflow={script} />
              ))}
            </List>
          </Stack>
        </Page>
      )}
    />
  );
};

export default WorkflowSelectionByUserPage;
