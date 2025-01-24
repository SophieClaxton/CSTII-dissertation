import { ASTInstruction } from '../panel/models/AST/Instruction';
import { SelectableTag } from '../panel/models/InterfaceElement';
import { LevelOfSupport } from '../panel/support/script_support/userStruggleSupport/userSupportMII';

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
  | 'loaded'
  | 'close_side_panel'
  | 'user_clicked_element'
  | 'user_struggle_data'
  | 'step_completed';

type PanelMessage =
  | SetClickableMessage
  | SetFocusMessage
  | UnsetFocusMessage
  | SystemClickElementMessage
  | StartSupportMessage
  | EndSupportMessage
  | NextPossibleStepsMessage;

type ContentScriptMessage =
  | LoadedMessage
  | CloseSidePanelMessage
  | UserClickedElementMessage
  | UserStruggleDataMessage
  | StepCompletedMessage;

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
  tag: SelectableTag;
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
  levelOfSupport: LevelOfSupport;
}

interface EndSupportMessage extends MessageBase {
  type: 'end_support';
}

interface NextPossibleStepsMessage extends MessageBase {
  type: 'next_possible_steps';
  steps: ASTInstruction[];
}

// Content Script messages

interface LoadedMessage extends MessageBase {
  type: 'loaded';
}

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

interface StepCompletedMessage extends MessageBase {
  type: 'step_completed';
  step: ASTInstruction;
}

export { Port };
export type {
  PanelMessage,
  SetClickableMessage,
  SetFocusMessage,
  UnsetFocusMessage,
  SystemClickElementMessage,
  StartSupportMessage,
  EndSupportMessage,
  NextPossibleStepsMessage,
  ContentScriptMessage,
  LoadedMessage,
  CloseSidePanelMessage,
  UserClickedElementMessage,
  UserStruggleData,
  UserStruggleDataMessage,
  StepCompletedMessage,
};
