const setCurrentTab = async (setTab: (value: chrome.tabs.Tab) => void) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (!tab) {
    throw Error('Could not get active tabs');
  }

  setTab(tab);
};

const setTabListeners = (setTab: (value: chrome.tabs.Tab) => void) => {
  chrome.tabs.onUpdated.addListener(
    (_: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (changeInfo.status === 'complete') {
        console.log('Active tab was updated');
        setCurrentTab(setTab);
      }
    },
  );
  chrome.tabs.onActivated.addListener(
    (activeInfo: chrome.tabs.TabActiveInfo) => {
      console.log('New active tab');
      chrome.tabs.get(activeInfo.tabId, (tab: chrome.tabs.Tab) => setTab(tab));
    },
  );
};

export { setCurrentTab, setTabListeners };
