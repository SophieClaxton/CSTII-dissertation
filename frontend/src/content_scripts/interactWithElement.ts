import stringSimilarity from 'string-similarity-js';
import { similarityThreshold } from './consts';
import {
  SystemClickElementMessage,
  UserClickedElementMessage,
} from '../common/message';
import { EditingState } from './state';
import { isSelectableTag } from '../panel/models/InterfaceElement';

const onClickElement =
  (message: SystemClickElementMessage) =>
  (element: HTMLAnchorElement | HTMLButtonElement) => {
    if (
      stringSimilarity(element.outerHTML, message.element) > similarityThreshold
    ) {
      console.log('found element to click');
      element.click();
    }
  };

const onSystemClickElement = (message: SystemClickElementMessage) => {
  document.querySelectorAll('button').forEach(onClickElement(message));
  document.querySelectorAll('a').forEach(onClickElement(message));
};

const onUserClickElement = (
  editingState: EditingState,
  element: Element,
  updateClassList: () => void,
) => {
  if (
    editingState.isClickable &&
    isSelectableTag(element.tagName) &&
    editingState.validTags.includes(element.tagName)
  ) {
    element.classList.remove('clickable');
    const message: UserClickedElementMessage = {
      type: 'user_clicked_element',
      elementOuterHtml: element.outerHTML,
      elementTag: element.tagName,
      elementTextContent: element.textContent,
      stepId: editingState.stepId,
      url: editingState.url,
      newUrl: element.hasAttribute('href')
        ? (element as HTMLLinkElement).href
        : '',
    };
    chrome.runtime.sendMessage(message);
    editingState.isClickable = !editingState.isClickable;
    updateClassList();
  }
};

export { onSystemClickElement, onUserClickElement };
