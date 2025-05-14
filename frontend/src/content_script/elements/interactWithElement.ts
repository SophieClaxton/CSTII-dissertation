import { UserClickedElementMessage } from '../../messaging/message';
import { EditingState } from '../interactive_support/state';
import {
  elementSatisfiesValidTags,
  findElement,
  getCorrespondingLabel,
} from './elementUtils';
import { clickableClass } from '../consts';
import InterfaceElement from '../../side_panel/models/interface_element/InterfaceElement';
import { isSelectableTag } from '../../side_panel/models/interface_element/selectableTag';

const isHTMLElement = (element: Element): element is HTMLElement => {
  return 'outerText' in element && 'innerText' in element;
};

const onSystemClickElement = (msgElement: InterfaceElement) => {
  const element = findElement(msgElement);
  if (element && isHTMLElement(element)) {
    element.click();
  }
};

const onUserClickElement = (
  editingState: EditingState,
  element: Element,
  updateClassList: () => void,
) => {
  if (
    editingState.isClickable &&
    isSelectableTag(element.tagName) &&
    elementSatisfiesValidTags(element, editingState.validTags)
  ) {
    console.log(`Clicked ${element.tagName} element: ${element.textContent}`);
    element.classList.remove(clickableClass);
    const message: UserClickedElementMessage = {
      type: 'user_clicked_element',
      element: {
        outerHTML: element.outerHTML,
        tag: element.tagName,
        textContent: element.textContent ?? undefined,
        url: editingState.url,
        label: getCorrespondingLabel(element),
      },
      stepId: editingState.stepId,
    };
    chrome.runtime.sendMessage(message);
    console.log('sent message');
    editingState.isClickable = !editingState.isClickable;
    updateClassList();
  }
};

export { onSystemClickElement, onUserClickElement };
