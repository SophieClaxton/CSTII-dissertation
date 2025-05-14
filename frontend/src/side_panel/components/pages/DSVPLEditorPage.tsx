import { UnpublishedWorkflowContextProvider } from '../../contexts/UnpublishedWorkflowContext';
import { useNavigationContext } from '../../contexts/contextHooks';
import { getUnpublishedTaskWorkflow } from '../../api/unpublishedTaskWorkflows';
import { assertIsDSVPLEditorScreen } from '../../navigation/screenChecks';
import Loadable from '../Loadable';
import Page from '../Page';
import { useAPICall } from '../../api/apiHooks';
import { useCallback } from 'react';
import DSVPLEditor from '../../task_workflows/DSVPL_editor/components/DSVPLEditor';

const DSVPLEditorPage: React.FC = () => {
  const { currentScreen } = useNavigationContext();
  assertIsDSVPLEditorScreen(currentScreen);

  const unpublishedWorkflowData = useAPICall(
    useCallback(
      () => getUnpublishedTaskWorkflow(currentScreen.params.workflowId),
      [currentScreen],
    ),
  );

  return (
    <Page title={'DSVPL Editor'}>
      <Loadable
        response={unpublishedWorkflowData}
        onLoad={(script) => (
          <UnpublishedWorkflowContextProvider script={script}>
            <DSVPLEditor />
          </UnpublishedWorkflowContextProvider>
        )}
      />
    </Page>
  );
};

export default DSVPLEditorPage;
