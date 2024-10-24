import { ContextMenuActions, openSidePanelAction, closeSidePanelAction } from './contextMenuActions';
import { MessageType } from '../common/message';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(openSidePanelAction);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === ContextMenuActions.OpenSidePanel) {
    chrome.sidePanel.open({ windowId: tab!.windowId });
    chrome.contextMenus.remove(ContextMenuActions.OpenSidePanel);
    chrome.contextMenus.create(closeSidePanelAction);
  }

  if (info.menuItemId === ContextMenuActions.CloseSidePanel) {
    chrome.runtime.sendMessage(MessageType.CloseSidePanel);
    chrome.contextMenus.remove(ContextMenuActions.CloseSidePanel);
    chrome.contextMenus.create(openSidePanelAction);
  }
});
