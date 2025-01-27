import HelperScriptSelector from '../userScripts/HelperScriptSelector';
import Editor from '../editor/EditorScreen';
import ScriptSelectionPage from '../support/script_selection/ScriptSelectionPage';
import UserScriptSelectionPage from '../support/script_selection/UserScriptSelectionPage';
import WebsiteScriptSelectionPage from '../support/script_selection/WebsiteScriptSelectionPage';
import {
  EditorScreen,
  HelperScriptsScreen,
  ScriptSelectorScreen,
  ScriptSupportScreen,
  UserScriptSelectorScreen,
  WebsiteScriptSelectorScreen,
} from './ScreenType';
import ScriptSupportPage from '../support/script_support/ScriptSupportPage';

const helperScriptsScreen: HelperScriptsScreen = {
  type: 'HelperScripts',
  component: <HelperScriptSelector />,
};

const editorScreen = (scriptId: number): EditorScreen => ({
  type: 'Editor',
  params: { scriptId: scriptId },
  component: <Editor />,
});

const scriptSelectorScreen: ScriptSelectorScreen = {
  type: 'ScriptSelector',
  component: <ScriptSelectionPage />,
};

const userScriptSelectorScreen = (
  userId: number,
): UserScriptSelectorScreen => ({
  type: 'UserScriptSelector',
  params: { userId: userId },
  component: <UserScriptSelectionPage />,
});

const websiteScriptSelectorScreen = (
  websiteId: number,
): WebsiteScriptSelectorScreen => ({
  type: 'WebsiteScriptSelector',
  params: { websiteId: websiteId },
  component: <WebsiteScriptSelectionPage />,
});

const scriptSupportScreen = (scriptId: number): ScriptSupportScreen => ({
  type: 'ScriptSupport',
  params: { scriptId: scriptId },
  component: <ScriptSupportPage />,
});

export {
  helperScriptsScreen,
  editorScreen,
  scriptSelectorScreen,
  userScriptSelectorScreen,
  websiteScriptSelectorScreen,
  scriptSupportScreen,
};
