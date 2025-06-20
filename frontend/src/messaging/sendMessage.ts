import { ASTInstruction } from '../side_panel/models/AST/Instruction';
import { CSTElementNode, CSTNodeId } from '../side_panel/models/CST/CST';
import InterfaceElement from '../side_panel/models/interface_element/InterfaceElement';
import { LevelOfSupport } from '../side_panel/models/support_and_MII/UserSupport';
import { mapIdToString } from '../side_panel/task_workflows/unpublished_task_workflow_reducer/mappers/nodeIds';
import {
  EndSupportMessage,
  NextPossibleStepsMessage,
  SetClickableMessage,
  SetFocusMessage,
  StartSupportMessage,
  UnsetFocusMessage,
} from './message';

const sendClickabilityMessage = async (
  tabId: number,
  stepId: CSTNodeId,
  stepType: CSTElementNode['type'],
  url: string,
) => {
  const message: SetClickableMessage = {
    type: 'set_clickable',
    stepId: mapIdToString(stepId),
    stepType,
    url,
  };
  chrome.tabs.sendMessage(tabId, message).catch((error) => console.log(error));
};

const sendSetFocusMessage = async (
  tabId: number,
  element: InterfaceElement,
) => {
  const message: SetFocusMessage = {
    type: 'set_focus',
    element: element,
  };

  chrome.tabs.sendMessage(tabId, message).catch((error) => console.log(error));
};

const sendUnsetFocusMessage = async (tabId: number) => {
  const message: UnsetFocusMessage = {
    type: 'unset_focus',
  };

  chrome.tabs.sendMessage(tabId, message).catch((error) => console.log(error));
};

const sendStartSupportMessage = async (
  tabId: number,
  levelOfSupport: LevelOfSupport,
) => {
  const message: StartSupportMessage = {
    type: 'start_support',
    levelOfSupport,
  };

  chrome.tabs.sendMessage(tabId, message).catch((error) => console.log(error));
};

const sendEndSupportMessage = async (tabId: number) => {
  const message: EndSupportMessage = {
    type: 'end_support',
  };

  chrome.tabs.sendMessage(tabId, message).catch((error) => console.log(error));
};

const sendNextPossibleStepsMessage = async (
  tabId: number,
  nextSteps: ASTInstruction[],
) => {
  const message: NextPossibleStepsMessage = {
    type: 'next_possible_steps',
    steps: nextSteps,
  };

  chrome.tabs.sendMessage(tabId, message).catch((error) => console.log(error));
};

export {
  sendClickabilityMessage,
  sendSetFocusMessage,
  sendUnsetFocusMessage,
  sendStartSupportMessage,
  sendEndSupportMessage,
  sendNextPossibleStepsMessage,
};
