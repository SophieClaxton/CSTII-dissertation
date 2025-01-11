import { SelectableTag } from '../panel/models/InterfaceElement';

enum Port {
  SidePanel = 'sidePanel',
}

type MessageType =
  | 'close_side_panel'
  | 'set_clickable'
  | 'clicked_element'
  | 'toggle_clickability'
  | 'toggle_focus'
  | 'click_element'
  | 'element';

type Message =
  | CloseSidePanelMessage
  | SetClickableMessage
  | ClickedElementMessage
  | ToggleFocusMessage
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
}

interface ClickedElementMessage extends MessageBase {
  type: 'clicked_element';
  elementOuterHtml: string;
  elementTag: string;
  elementTextContent: string | null;
  stepId: string;
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
  SetClickableMessage,
  ClickedElementMessage,
  ToggleFocusMessage,
  ClickElementMessage,
};
