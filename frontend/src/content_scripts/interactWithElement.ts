import { UserClickedElementMessage } from '../common/message';
import { EditingState } from './state';
import { isSelectableTag } from '../panel/models/InterfaceElement';
import { elementsMatch } from './elementUtils';

const onClickElement =
  (elementOuterHTML: string) =>
  (element: HTMLAnchorElement | HTMLButtonElement) => {
    if (elementsMatch(element, elementOuterHTML)) {
      // console.log('found element to click');
      element.click();
    }
  };

const onSystemClickElement = (elementOuterHTML: string) => {
  document.querySelectorAll('button').forEach(onClickElement(elementOuterHTML));
  document.querySelectorAll('a').forEach(onClickElement(elementOuterHTML));
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
    // BUG: issue with escaped characters in outerHTML string
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
