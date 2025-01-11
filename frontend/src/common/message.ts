enum Port {
  SidePanel = 'sidePanel',
}

type MessageType =
  | 'close_side_panel'
  | 'clicked_element'
  | 'toggle_clickability'
  | 'toggle_focus'
  | 'click_element';

type Message =
  | CloseSidePanelMessage
  | ClickedElementMessage
  | ToggleClickabilityMessage
  | ToggleFocusMessage
  | ClickElementMessage;

interface MessageBase {
  type: MessageType;
}

interface CloseSidePanelMessage extends MessageBase {
  type: 'close_side_panel';
}

interface ClickedElementMessage extends MessageBase {
  type: 'clicked_element';
  element: string;
  tag: string;
}

interface ToggleClickabilityMessage extends MessageBase {
  type: 'toggle_clickability';
}

interface ToggleFocusMessage extends MessageBase {
  type: 'toggle_focus';
  element: string;
}

interface ClickElementMessage extends MessageBase {
  type: 'click_element';
  element: string;
}

export { Port };
export type {
  MessageType,
  Message,
  CloseSidePanelMessage,
  ClickedElementMessage,
  ToggleClickabilityMessage,
  ToggleFocusMessage,
  ClickElementMessage,
};
