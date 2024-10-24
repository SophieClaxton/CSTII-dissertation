export enum ContextMenuActions {
  OpenSidePanel = 'open_side_panel',
  CloseSidePanel = 'close_side_panel',
}

export const openSidePanelAction: chrome.contextMenus.CreateProperties = {
  id: ContextMenuActions.OpenSidePanel as string,
  title: 'Open sc2370 side panel',
  contexts: ['all'],
};

export const closeSidePanelAction: chrome.contextMenus.CreateProperties = {
  id: ContextMenuActions.CloseSidePanel as string,
  title: 'Close sc2370 side panel',
  contexts: ['all'],
};
