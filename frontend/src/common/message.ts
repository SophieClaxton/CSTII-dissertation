export enum Port {
  SidePanel = 'sidePanel',
}

export enum MessageType {
  CloseSidePanel = 'close_side_panel',
  ClickedElement = 'clicked_element',
  ToggleClickability = 'toggle_clickability',
}

export interface Message {
  type: string;
}

export interface ClickedElementMessage extends Message {
  element: string;
}
