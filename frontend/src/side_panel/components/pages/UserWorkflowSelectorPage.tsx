import { useCallback, useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import { getUser } from '../../api/users';
import APIResponse from '../../models/api/APIResponse';
import Loadable from '../Loadable';
import List from '@mui/material/List/List';
import Typography from '@mui/material/Typography/Typography';
import { Button, Container, ListSubheader } from '@mui/material';
import { createUnpublishedTaskWorkflow } from '../../api/unpublishedTaskWorkflows';
import { dsvplEditorScreen } from '../../navigation/screens';
import Page from '../Page';
import { useAPICall } from '../../api/apiHooks';
import { UserWithWorkflows } from '../../models/api/User';
import UnpublishedWorkflowListItem from '../../task_workflows/user_task_workflows/UnpublishedWorkflowListItem';
import WorkflowListItem from '../../interactive_support/task_workflow_selection/WorkflowListItem';
import CreateUserDialog from '../../task_workflows/user_task_workflows/CreateUserDialog';

const UserWorkflowSelectorPage = () => {
  const { goTo } = useNavigationContext();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const userData = useAPICall(
    useCallback((): Promise<APIResponse<UserWithWorkflows>> => {
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
    <Page title={'Your Task Workflows'}>
      <Loadable
        response={userData}
        onLoad={(user) => (
          <Container maxWidth={'md'}>
            <Typography variant="subtitle2">Username: {user.name}</Typography>
            <div className="all-scripts-container">
              <List sx={{ width: '100%' }}>
                <ListSubheader>Unpublished Task Workflows</ListSubheader>
                <Button
                  variant={'outlined'}
                  sx={{ marginBottom: '0.5rem' }}
                  fullWidth
                  onClick={() => {
                    const createNewTaskWorkflow = async () => {
                      const response = await createUnpublishedTaskWorkflow(
                        user.id,
                      );
                      if (response.status === 'Loaded') {
                        console.log('Created new task workflow');
                        goTo(dsvplEditorScreen(response.data.id));
                      } else {
                        console.log('Could not create new task workflow');
                      }
                    };
                    createNewTaskWorkflow();
                  }}
                >
                  Create New Task Workflow
                </Button>
                {user.unpublished_scripts.map((script) => (
                  <UnpublishedWorkflowListItem script={script} />
                ))}
              </List>
              <List sx={{ width: '100%' }}>
                <ListSubheader>Published Task Workflows</ListSubheader>
                {user.scripts.map((script) => (
                  <WorkflowListItem workflow={script} />
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

export default UserWorkflowSelectorPage;
