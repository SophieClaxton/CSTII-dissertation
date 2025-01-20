import { ASTStepNodeInfo } from '../panel/models/AST/AST';
import { SelectableTag } from '../panel/models/InterfaceElement';

enum Port {
  SidePanel = 'sidePanel',
}

type PanelMessageType =
  | 'set_clickable'
  | 'set_focus'
  | 'unset_focus'
  | 'system_click_element'
  | 'start_support'
  | 'end_support'
  | 'next_possible_steps';

type ContentScriptMessageType =
  | 'close_side_panel'
  | 'user_clicked_element'
  | 'user_struggle_data';

type PanelMessage =
  | SetClickableMessage
  | SetFocusMessage
  | UnsetFocusMessage
  | SystemClickElementMessage
  | StartSupportMessage
  | EndSupportMessage
  | NextPossibleStepsMessage;

type ContentScriptMessage =
  | CloseSidePanelMessage
  | UserClickedElementMessage
  | UserStruggleDataMessage;

interface MessageBase {
  type: PanelMessageType | ContentScriptMessageType;
}

// Panel Messages

interface SetClickableMessage extends MessageBase {
  type: 'set_clickable';
  stepId: string;
  validTags: SelectableTag[];
  url: string;
}

interface SetFocusMessage extends MessageBase {
  type: 'set_focus';
  element: string;
}

interface UnsetFocusMessage extends MessageBase {
  type: 'unset_focus';
}

interface SystemClickElementMessage extends MessageBase {
  type: 'system_click_element';
  element: string;
}

interface StartSupportMessage extends MessageBase {
  type: 'start_support';
}

interface EndSupportMessage extends MessageBase {
  type: 'end_support';
}

interface NextPossibleStepsMessage extends MessageBase {
  type: 'next_possible_steps';
  steps: ASTStepNodeInfo[];
}

// Content Script messages

interface CloseSidePanelMessage extends MessageBase {
  type: 'close_side_panel';
}

interface UserClickedElementMessage extends MessageBase {
  type: 'user_clicked_element';
  elementOuterHtml: string;
  elementTag: string;
  elementTextContent: string | null;
  stepId: string;
  url: string;
  newUrl: string;
}

interface UserStruggleData {
  totalDistance: number;
  numMouseClicks: number;
}

interface UserStruggleDataMessage extends MessageBase {
  type: 'user_struggle_data';
  userStruggleData: UserStruggleData;
}

export { Port };
export type {
  PanelMessage,
  ContentScriptMessage,
  SetClickableMessage,
  SetFocusMessage,
  UnsetFocusMessage,
  SystemClickElementMessage,
  StartSupportMessage,
  EndSupportMessage,
  CloseSidePanelMessage,
  UserClickedElementMessage,
  UserStruggleData,
  UserStruggleDataMessage,
  NextPossibleStepsMessage,
};
