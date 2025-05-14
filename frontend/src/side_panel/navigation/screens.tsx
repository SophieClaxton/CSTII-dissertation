import UserWorkflowSelectorPage from '../components/pages/UserWorkflowSelectorPage';
import DSVPLEditorPage from '../components/pages/DSVPLEditorPage';
import WorkflowSelectionPage from '../components/pages/WorkflowSelectionPage';
import WorkflowSelectionByUserPage from '../components/pages/WorkflowSelectionByUserPage';
import WorkflowSelectionByWebsitePage from '../components/pages/WorkflowSelectionByWebsitePage';
import {
  DSVPLEditorScreen,
  WorkflowEncoderWorkflowsScreen,
  WorkflowSelectorScreen,
  WorkflowSupportScreen,
  UserWorkflowSelectorScreen,
  WebsiteWorkflowSelectorScreen,
} from './ScreenType';
import WorkflowSupportPage from '../components/pages/WorkflowSupportPage';

const workflowEncoderWorkflowsScreen: WorkflowEncoderWorkflowsScreen = {
  type: 'WorkflowEncoderWorkflows',
  component: <UserWorkflowSelectorPage />,
};

const dsvplEditorScreen = (workflowId: number): DSVPLEditorScreen => ({
  type: 'DSVPLEditor',
  params: { workflowId },
  component: <DSVPLEditorPage />,
});

const workflowSelectorScreen: WorkflowSelectorScreen = {
  type: 'WorkflowSelector',
  component: <WorkflowSelectionPage />,
};

const userWorkflowSelectorScreen = (
  userId: number,
): UserWorkflowSelectorScreen => ({
  type: 'UserWorkflowSelector',
  params: { userId: userId },
  component: <WorkflowSelectionByUserPage />,
});

const websiteWorkflowSelectorScreen = (
  websiteId: number,
): WebsiteWorkflowSelectorScreen => ({
  type: 'WebsiteWorkflowSelector',
  params: { websiteId: websiteId },
  component: <WorkflowSelectionByWebsitePage />,
});

const workflowSupportScreen = (workflowId: number): WorkflowSupportScreen => ({
  type: 'WorkflowSupport',
  params: { workflowId },
  component: <WorkflowSupportPage />,
});

export {
  workflowEncoderWorkflowsScreen,
  dsvplEditorScreen,
  workflowSelectorScreen,
  userWorkflowSelectorScreen,
  websiteWorkflowSelectorScreen,
  workflowSupportScreen,
};
