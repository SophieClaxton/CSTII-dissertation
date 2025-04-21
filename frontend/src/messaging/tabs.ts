import { TabInfo } from '../side_panel/contexts/TabContext';
import { StateSetter } from '../side_panel/models/utilTypes';
import { ContentScriptMessage } from './message';

const setCurrentTab = async (
  setTab: StateSetter<TabInfo | undefined>,
  csLoaded: boolean = false,
) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (!tab) {
    throw Error('Could not get active tabs');
  }
  const newTab: TabInfo = {
    status: 'complete',
    url: tab.url ?? '',
    windowId: tab.windowId,
    id: tab.id!,
    scriptStatus: csLoaded ? 'loaded' : 'loading',
  };
  setTab(newTab);
};

const setTabListeners = (setTab: StateSetter<TabInfo | undefined>) => {
  chrome.tabs.onUpdated.addListener(
    (_: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (changeInfo.status === 'complete') {
        console.log('Active tab was updated');
        setCurrentTab(setTab);
      } else {
        setTab((prevState) => {
          if (prevState) {
            return { ...prevState, status: 'loading' };
          }
        });
      }
    },
  );
  chrome.tabs.onActivated.addListener(
    (activeInfo: chrome.tabs.TabActiveInfo) => {
      console.log('New active tab');
      chrome.tabs.get(activeInfo.tabId, (tab: chrome.tabs.Tab) =>
        setTab({
          status: tab.status
            ? 'loading'
            : (tab.status as 'unloaded' | 'loading' | 'complete'),
          url: tab.url ?? '',
          windowId: tab.windowId,
          id: tab.id!,
          scriptStatus: 'loading',
        }),
      );
    },
  );
  chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
    if (message.type === 'loaded') {
      console.log('Received loaded message');
      setTab((prevState) => {
        if (prevState) {
          return { ...prevState, scriptStatus: 'loaded' };
        }
      });
    }
  });
};

export { setCurrentTab, setTabListeners };
