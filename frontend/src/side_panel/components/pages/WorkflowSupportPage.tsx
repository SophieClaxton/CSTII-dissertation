import { useCallback } from 'react';
import { sendEndSupportMessage } from '../../../messaging/sendMessage';
import { useAPICall } from '../../api/apiHooks';
import { getTaskWorkflow } from '../../api/taskWorkflows';
import Loadable from '../Loadable';
import Page from '../Page';
import {
  useNavigationContext,
  useTabContext,
} from '../../contexts/contextHooks';
import { assertIsWorkflowSupportScreen } from '../../navigation/screenChecks';
import WorkflowSupport from '../../interactive_support/support_interface/WorkflowSupport';

const WorkflowSupportPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsWorkflowSupportScreen(currentScreen);

  const { tab } = useTabContext();
  const scriptData = useAPICall(
    useCallback(
      () => getTaskWorkflow(currentScreen.params.workflowId),
      [currentScreen],
    ),
  );

  return (
    <Page title={'Get Support'} onBack={() => sendEndSupportMessage(tab.id)}>
      <Loadable
        response={scriptData}
        onLoad={(script) => <WorkflowSupport workflow={script} />}
      />
    </Page>
  );
};

export default WorkflowSupportPage;
