import { useEffect, useState } from 'react';
import { TaskWorkflowWithAuthorAndWebsite } from '../../models/api/TaskWorkflow';
import { getTaskWorkflows } from '../../api/taskWorkflows';
import List from '@mui/material/List/List';
import Website from '../../models/api/Website';
import User from '../../models/api/User';
import { getWebsites } from '../../api/websites';
import { getUsers } from '../../api/users';
import Loadable from '../Loadable';
import Page from '../Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api/apiHooks';
import FilterBar from '../../interactive_support/task_workflow_selection/FilterBar';
import WorkflowListItem from '../../interactive_support/task_workflow_selection/WorkflowListItem';
import WorkflowFilterDialog from '../../interactive_support/task_workflow_selection/WorkflowFilterDialog';

const WorkflowSelectionPage: React.FC = () => {
  const scriptsData = useAPICall(getTaskWorkflows);
  const websitesData = useAPICall(getWebsites);
  const authorsData = useAPICall(getUsers);

  const [workflows, setWorkflows] = useState<
    TaskWorkflowWithAuthorAndWebsite[]
  >([]);

  const [websiteFilters, setWebsiteFilters] = useState<Website[]>([]);
  const [authorFilters, setAuthorFilters] = useState<User[]>([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    if (scriptsData.status != 'Loaded') {
      return;
    }
    if (websiteFilters.length > 0 || authorFilters.length > 0) {
      setWorkflows(
        scriptsData.data.filter(
          (script) =>
            websiteFilters
              .map((website) => website.id)
              .includes(script.website.id) ||
            authorFilters.map((author) => author.id).includes(script.author.id),
        ),
      );
    } else {
      setWorkflows(scriptsData.data);
    }
  }, [scriptsData, websiteFilters, authorFilters]);

  return (
    <Page title={'Select Support'}>
      <Loadable
        response={scriptsData}
        onLoad={() => (
          <Stack direction={'column'} spacing={1} padding={'0.5rem'}>
            <FilterBar
              setOpenFilterDialog={setOpenFilterDialog}
              websiteFilters={websiteFilters}
              setWebsiteFilters={setWebsiteFilters}
              authorFilters={authorFilters}
              setAuthorFilters={setAuthorFilters}
            />
            <List disablePadding>
              {workflows.map((script) => (
                <WorkflowListItem workflow={script} />
              ))}
            </List>
          </Stack>
        )}
      />
      <WorkflowFilterDialog
        open={openFilterDialog}
        setOpen={setOpenFilterDialog}
        websites={websitesData.status === 'Loaded' ? websitesData.data : []}
        authors={authorsData.status === 'Loaded' ? authorsData.data : []}
        websiteFilters={websiteFilters}
        setWebsiteFilters={setWebsiteFilters}
        authorFilters={authorFilters}
        setAuthorFilters={setAuthorFilters}
      />
    </Page>
  );
};

export default WorkflowSelectionPage;
