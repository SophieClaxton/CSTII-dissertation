import { ReactNode } from 'react';

type PanelScreen =
  | WorkflowEncoderWorkflowsScreen
  | DSVPLEditorScreen
  | WorkflowSelectorScreen
  | UserWorkflowSelectorScreen
  | WebsiteWorkflowSelectorScreen
  | WorkflowSupportScreen;

interface ScreenBase {
  type: ScreenType;
  params?: unknown;
  component: ReactNode;
}

type ScreenType = WorkflowEncoderScreenType | SupportSeekerScreenType;

type WorkflowEncoderScreenType = 'WorkflowEncoderWorkflows' | 'DSVPLEditor';
type SupportSeekerScreenType =
  | 'WorkflowSelector'
  | 'UserWorkflowSelector'
  | 'WebsiteWorkflowSelector'
  | 'WorkflowSupport';

interface WorkflowEncoderWorkflowsScreen extends ScreenBase {
  type: 'WorkflowEncoderWorkflows';
}

interface DSVPLEditorScreen extends ScreenBase {
  type: 'DSVPLEditor';
  params: { workflowId: number };
}

interface WorkflowSelectorScreen extends ScreenBase {
  type: 'WorkflowSelector';
}

interface UserWorkflowSelectorScreen extends ScreenBase {
  type: 'UserWorkflowSelector';
  params: { userId: number };
}

interface WebsiteWorkflowSelectorScreen extends ScreenBase {
  type: 'WebsiteWorkflowSelector';
  params: { websiteId: number };
}

interface WorkflowSupportScreen extends ScreenBase {
  type: 'WorkflowSupport';
  params: { workflowId: number };
}

export type {
  ScreenType,
  PanelScreen,
  WorkflowEncoderWorkflowsScreen,
  DSVPLEditorScreen,
  WorkflowSelectorScreen,
  UserWorkflowSelectorScreen,
  WebsiteWorkflowSelectorScreen,
  WorkflowSupportScreen,
};
