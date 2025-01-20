import { createContext } from 'react';

interface TabContextState {
  tab: chrome.tabs.Tab | undefined;
}

const TabContext = createContext<TabContextState | undefined>(undefined);

export default TabContext;
