import { ASTInstruction } from '../side_panel/models/AST/Instruction';
import { CSTElementNode } from '../side_panel/models/CST/CST';
import InterfaceElement from '../side_panel/models/interface_element/InterfaceElement';
import {
  LevelOfSupport,
  InteractionData,
} from '../side_panel/models/support_and_MII/UserSupport';

enum Port {
  SidePanel = 'sidePanel',
}

type PanelMessageType =
  | 'set_clickable'
  | 'set_focus'
  | 'unset_focus'
  | 'start_support'
  | 'end_support'
  | 'next_possible_steps';

type ContentScriptMessageType =
  | 'loaded'
  | 'close_side_panel'
  | 'user_clicked_element'
  | 'interaction_data'
  | 'step_completed';

type PanelMessage =
  | SetClickableMessage
  | SetFocusMessage
  | UnsetFocusMessage
  | StartSupportMessage
  | EndSupportMessage
  | NextPossibleStepsMessage;

type ContentScriptMessage =
  | LoadedMessage
  | CloseSidePanelMessage
  | UserClickedElementMessage
  | InteractionDataMessage
  | StepCompletedMessage;

interface MessageBase {
  type: PanelMessageType | ContentScriptMessageType;
}

// Panel Messages

interface SetClickableMessage extends MessageBase {
  type: 'set_clickable';
  stepId: string;
  stepType: CSTElementNode['type'];
  url: string;
}

interface SetFocusMessage extends MessageBase {
  type: 'set_focus';
  element: InterfaceElement;
}

interface UnsetFocusMessage extends MessageBase {
  type: 'unset_focus';
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
  element: InterfaceElement;
  stepId: string;
}

interface InteractionDataMessage extends MessageBase {
  type: 'interaction_data';
  interactionData: InteractionData;
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
  StartSupportMessage,
  EndSupportMessage,
  NextPossibleStepsMessage,
  ContentScriptMessage,
  LoadedMessage,
  CloseSidePanelMessage,
  UserClickedElementMessage,
  InteractionDataMessage,
  StepCompletedMessage,
};
