import {
  PanelScreen,
  UserWorkflowSelectorScreen,
  WebsiteWorkflowSelectorScreen,
  WorkflowSupportScreen,
  DSVPLEditorScreen,
} from './ScreenType';

function assertIsDSVPLEditorScreen(
  screen: PanelScreen | undefined,
): asserts screen is DSVPLEditorScreen {
  if (screen?.type != 'DSVPLEditor') {
    throw new Error(`Assert ${screen} as DSVPLEditorScreen failed`);
  }
}

function assertIsUserWorkflowSelectorScreen(
  screen: PanelScreen | undefined,
): asserts screen is UserWorkflowSelectorScreen {
  if (screen?.type != 'UserWorkflowSelector') {
    throw new Error(`Assert ${screen} as UserWorkflowSelectorScreen failed`);
  }
}

function assertIsWebsiteWorkflowSelectorScreen(
  screen: PanelScreen | undefined,
): asserts screen is WebsiteWorkflowSelectorScreen {
  if (screen?.type != 'WebsiteWorkflowSelector') {
    throw new Error(`Assert ${screen} as WebsiteWorkflowSelectorScreen failed`);
  }
}

function assertIsWorkflowSupportScreen(
  screen: PanelScreen | undefined,
): asserts screen is WorkflowSupportScreen {
  if (screen?.type != 'WorkflowSupport') {
    throw new Error(`Assert ${screen} as WorkflowSupportScreen failed`);
  }
}

export {
  assertIsDSVPLEditorScreen,
  assertIsUserWorkflowSelectorScreen,
  assertIsWebsiteWorkflowSelectorScreen,
  assertIsWorkflowSupportScreen,
};
