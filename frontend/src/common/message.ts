import { SelectableTag } from '../panel/models/InterfaceElement';

enum Port {
  SidePanel = 'sidePanel',
}

type MessageType =
  | 'close_side_panel'
  | 'set_clickable'
  | 'user_clicked_element'
  | 'set_focus'
  | 'unset_focus'
  | 'system_click_element'
  | 'start_support'
  | 'end_support';

type Message =
  | CloseSidePanelMessage
  | SetClickableMessage
  | SetFocusMessage
  | UnsetFocusMessage
  | ClickedElementMessage
  | ClickElementMessage
  | StartSupportMessage
  | EndSupportMessage;

interface MessageBase {
  type: MessageType;
}

interface CloseSidePanelMessage extends MessageBase {
  type: 'close_side_panel';
}

interface SetClickableMessage extends MessageBase {
  type: 'set_clickable';
  stepId: string;
  validTags: SelectableTag[];
  url: string;
}

interface ClickedElementMessage extends MessageBase {
  type: 'user_clicked_element';
  elementOuterHtml: string;
  elementTag: string;
  elementTextContent: string | null;
  stepId: string;
  url: string;
  newUrl: string;
}

interface SetFocusMessage extends MessageBase {
  type: 'set_focus';
  element: string;
}

interface UnsetFocusMessage extends MessageBase {
  type: 'unset_focus';
}

interface ClickElementMessage extends MessageBase {
  type: 'system_click_element';
  element: string;
}

interface StartSupportMessage extends MessageBase {
  type: 'start_support';
}

interface EndSupportMessage extends MessageBase {
  type: 'end_support';
}

export { Port };
export type {
  MessageType,
  Message,
  CloseSidePanelMessage,
  SetClickableMessage,
  ClickedElementMessage,
  SetFocusMessage,
  UnsetFocusMessage,
  ClickElementMessage,
  StartSupportMessage,
  EndSupportMessage,
};
