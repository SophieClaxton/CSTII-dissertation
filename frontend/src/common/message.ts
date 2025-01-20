import { SelectableTag } from '../panel/models/InterfaceElement';

enum Port {
  SidePanel = 'sidePanel',
}

type MessageType =
  | 'close_side_panel'
  | 'set_clickable'
  | 'clicked_element'
  | 'set_focus'
  | 'unset_focus'
  | 'click_element'
  | 'element';

type Message =
  | CloseSidePanelMessage
  | SetClickableMessage
  | SetFocusMessage
  | UnsetFocusMessage
  | ClickedElementMessage
  | ClickElementMessage;

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
  type: 'clicked_element';
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
  type: 'click_element';
  element: string;
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
};
