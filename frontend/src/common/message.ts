export enum Port {
  SidePanel = 'sidePanel',
  Content = 'content',
}

export enum MessageType {
  CloseSidePanel = 'close_side_panel',
  ClickedElement = 'clicked_element',
}

export interface Message {
  type: string;
}

export interface ClickedElementMessage extends Message {
  element: string;
}
