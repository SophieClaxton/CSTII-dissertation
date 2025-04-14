import UserScriptSelectorPage from '../components/pages/UserScriptSelectorPage';
import EditorPage from '../components/pages/EditorPage';
import ScriptSelectionPage from '../components/pages/ScriptSelectionPage';
import ScriptSelectionByUserPage from '../components/pages/ScriptSelectionByUserPage';
import ScriptSelectionByWebsitePage from '../components/pages/ScriptSelectionByWebsitePage';
import {
  EditorScreen,
  HelperScriptsScreen,
  ScriptSelectorScreen,
  ScriptSupportScreen,
  UserScriptSelectorScreen,
  WebsiteScriptSelectorScreen,
} from './ScreenType';
import ScriptSupportPage from '../components/pages/ScriptSupportPage';

const helperScriptsScreen: HelperScriptsScreen = {
  type: 'HelperScripts',
  component: <UserScriptSelectorPage />,
};

const editorScreen = (scriptId: number): EditorScreen => ({
  type: 'Editor',
  params: { scriptId: scriptId },
  component: <EditorPage />,
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
  component: <ScriptSelectionByUserPage />,
});

const websiteScriptSelectorScreen = (
  websiteId: number,
): WebsiteScriptSelectorScreen => ({
  type: 'WebsiteScriptSelector',
  params: { websiteId: websiteId },
  component: <ScriptSelectionByWebsitePage />,
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
