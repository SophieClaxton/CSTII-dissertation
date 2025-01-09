import { ReactNode } from 'react';

type PanelScreen =
  | EditorScreen
  | ScriptSelectorScreen
  | UserScriptSelectorScreen
  | WebsiteScriptSelectorScreen
  | ScriptSupportScreen;

interface ScreenBase {
  type: ScreenType;
  params?: unknown;
  component: ReactNode;
}

type ScreenType = HelperScreenType | HelpeeScreenType;

type HelperScreenType = 'Editor';
type HelpeeScreenType =
  | 'ScriptSelector'
  | 'UserScriptSelector'
  | 'WebsiteScriptSelector'
  | 'ScriptSupport';

interface EditorScreen extends ScreenBase {
  type: 'Editor';
}

interface ScriptSelectorScreen extends ScreenBase {
  type: 'ScriptSelector';
}

interface UserScriptSelectorScreen extends ScreenBase {
  type: 'UserScriptSelector';
  params: { userId: number };
}

interface WebsiteScriptSelectorScreen extends ScreenBase {
  type: 'WebsiteScriptSelector';
  params: { websiteId: number };
}

interface ScriptSupportScreen extends ScreenBase {
  type: 'ScriptSupport';
  params: { scriptId: number };
}

export type {
  ScreenType,
  PanelScreen,
  EditorScreen,
  ScriptSelectorScreen,
  UserScriptSelectorScreen,
  WebsiteScriptSelectorScreen,
  ScriptSupportScreen,
};
