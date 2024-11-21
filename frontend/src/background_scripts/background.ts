import {
  ContextMenuActions,
  openSidePanelAction,
  closeSidePanelAction,
} from './contextMenuActions';
import { Message, MessageType, Port } from '../common/message';

/*
Chrome only allows one action item on the main context menu per extension.
When there are multiple context menu actions, they are nested under a single
parent.

Only one context menu action is valid at a time, so to avoid unnecessary
nesting, the actions are removed and re-created each time they are swapped.
*/

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(openSidePanelAction);
});

/* Disable the automatic action configuration, so that it can be customised */
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });

chrome.action.onClicked.addListener((tab) => {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create(closeSidePanelAction);
  chrome.sidePanel.open({ windowId: tab!.windowId });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === ContextMenuActions.OpenSidePanel) {
    chrome.sidePanel.open({ windowId: tab!.windowId });
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create(closeSidePanelAction);
  }

  if (info.menuItemId === ContextMenuActions.CloseSidePanel) {
    const message: Message = { type: MessageType.CloseSidePanel };
    chrome.runtime.sendMessage(message);
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create(openSidePanelAction);
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === Port.SidePanel) {
    port.onDisconnect.addListener(() => {
      chrome.contextMenus.removeAll();
      chrome.contextMenus.create(openSidePanelAction);
    });
  }
});
