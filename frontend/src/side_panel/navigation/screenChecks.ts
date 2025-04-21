import {
  PanelScreen,
  UserScriptSelectorScreen,
  WebsiteScriptSelectorScreen,
  ScriptSupportScreen,
  EditorScreen,
} from './ScreenType';

function assertIsEditorScreen(
  screen: PanelScreen | undefined,
): asserts screen is EditorScreen {
  if (screen?.type != 'Editor') {
    throw new Error(`Assert ${screen} as EditorScreen failed`);
  }
}

function assertIsUserScriptSelectorScreen(
  screen: PanelScreen | undefined,
): asserts screen is UserScriptSelectorScreen {
  if (screen?.type != 'UserScriptSelector') {
    throw new Error(`Assert ${screen} as UserScriptSelectorScreen failed`);
  }
}

function assertIsWebsiteScriptSelectorScreen(
  screen: PanelScreen | undefined,
): asserts screen is WebsiteScriptSelectorScreen {
  if (screen?.type != 'WebsiteScriptSelector') {
    throw new Error(`Assert ${screen} as WebsiteScriptSelectorScreen failed`);
  }
}

function assertIsScriptSupportScreen(
  screen: PanelScreen | undefined,
): asserts screen is ScriptSupportScreen {
  if (screen?.type != 'ScriptSupport') {
    throw new Error(`Assert ${screen} as ScriptSupportScreen failed`);
  }
}

export {
  assertIsEditorScreen,
  assertIsUserScriptSelectorScreen,
  assertIsWebsiteScriptSelectorScreen,
  assertIsScriptSupportScreen,
};
