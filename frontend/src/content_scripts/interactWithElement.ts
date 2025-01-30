import { UserClickedElementMessage } from '../common/message';
import { EditingState } from './userSupport/state';
import InterfaceElement, {
  isSelectableTag,
} from '../panel/models/InterfaceElement';
import { findFirstElement } from './elementUtils';

const isHTMLElement = (element: Element): element is HTMLElement => {
  return 'outerText' in element && 'innerText' in element;
};

const onSystemClickElement = (msgElement: InterfaceElement) => {
  const element = findFirstElement(msgElement);
  if (element && isHTMLElement(element)) {
    element.click();
  }
};

const onUserClickElement = (
  editingState: EditingState,
  element: Element,
  updateClassList: () => void,
) => {
  console.log(`Clicked ${element.tagName}`);
  console.log(editingState);
  if (
    editingState.isClickable &&
    isSelectableTag(element.tagName) &&
    editingState.validTags.includes(element.tagName)
  ) {
    console.log(`Clicked ${element.tagName} element: ${element.textContent}`);
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
    console.log('sent message');
    editingState.isClickable = !editingState.isClickable;
    updateClassList();
  }
};

export { onSystemClickElement, onUserClickElement };
