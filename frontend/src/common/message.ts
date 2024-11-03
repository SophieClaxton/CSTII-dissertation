export enum Port {
  SidePanel = 'sidePanel',
}

export enum MessageType {
  CloseSidePanel = 'close_side_panel',
  ClickedElement = 'clicked_element',
  ToggleClickability = 'toggle_clickability',
  ToggleFocus = 'toggle_focus',
  ClickElement = 'click_element',
}

export interface Message {
  type: string;
}

export interface ClickedElementMessage extends Message {
  element: string;
  tag: string;
}

export interface FocusOnMessage extends Message {
  element: string;
}

export interface ClickElementMessage extends Message {
  element: string;
}
