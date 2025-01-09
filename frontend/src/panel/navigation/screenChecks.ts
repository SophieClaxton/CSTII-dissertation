import {
  PanelScreen,
  UserScriptSelectorScreen,
  WebsiteScriptSelectorScreen,
  ScriptSupportScreen,
} from './ScreenType';

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
  assertIsUserScriptSelectorScreen,
  assertIsWebsiteScriptSelectorScreen,
  assertIsScriptSupportScreen,
};
