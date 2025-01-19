import { CSTNodeId } from '../panel/models/CST/CST';
import InterfaceElement, {
  SelectableTag,
} from '../panel/models/InterfaceElement';
import { mapIdToString } from '../panel/unpublishedScriptReducer/mappers/nodeIds';
import {
  SetClickableMessage,
  SetFocusMessage,
  UnsetFocusMessage,
} from './message';

const sendClickabilityMessage = async (
  stepId: CSTNodeId,
  validTags: SelectableTag[],
  url: string,
) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const message: SetClickableMessage = {
    type: 'set_clickable',
    stepId: mapIdToString(stepId),
    validTags,
    url,
  };
  if (tab?.id) {
    chrome.tabs
      .sendMessage(tab.id, message)
      .catch((error) => console.log(error));
  }
};

const sendSetFocusMessage = async (element: InterfaceElement) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const message: SetFocusMessage = {
    type: 'set_focus',
    element: element.outerHTML,
  };
  if (tab?.id) {
    chrome.tabs
      .sendMessage(tab.id, message)
      .catch((error) => console.log(error));
  }
};

const sendUnsetFocusMessage = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const message: UnsetFocusMessage = {
    type: 'unset_focus',
  };
  if (tab?.id) {
    chrome.tabs
      .sendMessage(tab.id, message)
      .catch((error) => console.log(error));
  }
};

export { sendClickabilityMessage, sendSetFocusMessage, sendUnsetFocusMessage };
