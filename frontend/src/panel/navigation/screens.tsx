import Editor from '../editor/Editor';
import ScriptSelectionPage from '../support/script_selection/ScriptSelectionPage';
import UserScriptSelectionPage from '../support/script_selection/UserScriptSelectionPage';
import WebsiteScriptSelectionPage from '../support/script_selection/WebsiteScriptSelectionPage';
import ScriptSupport from '../support/script_support/ScriptSupport';
import {
  EditorScreen,
  ScriptSelectorScreen,
  ScriptSupportScreen,
  UserScriptSelectorScreen,
  WebsiteScriptSelectorScreen,
} from './ScreenType';

const editorScreen: EditorScreen = {
  type: 'Editor',
  component: <Editor />,
};

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
  component: <ScriptSupport />,
});

export {
  editorScreen,
  scriptSelectorScreen,
  userScriptSelectorScreen,
  websiteScriptSelectorScreen,
  scriptSupportScreen,
};
