chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
