import { ASTStepNodeInfo } from '../panel/models/AST/AST';
import { CSTNodeId } from '../panel/models/CST/CST';
import InterfaceElement, {
  SelectableTag,
} from '../panel/models/InterfaceElement';
import { LevelOfSupport } from '../panel/support/script_support/userSupportMII';
import { mapIdToString } from '../panel/unpublishedScriptReducer/mappers/nodeIds';
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
  validTags: SelectableTag[],
  url: string,
) => {
  const message: SetClickableMessage = {
    type: 'set_clickable',
    stepId: mapIdToString(stepId),
    validTags,
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
    element: element.outerHTML,
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
  nextSteps: ASTStepNodeInfo[],
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
