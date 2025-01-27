import { createContext } from 'react';

interface TabInfo {
  status: 'unloaded' | 'loading' | 'complete';
  scriptStatus: 'loading' | 'loaded';
  url: string;
  id: number;
  windowId: number;
}

interface TabContextState {
  tab: TabInfo | undefined;
}

const TabContext = createContext<TabContextState | undefined>(undefined);

export default TabContext;
export type { TabInfo };
