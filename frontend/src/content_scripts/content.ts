import { ClickedElementMessage, Message } from '../common/message';
import {
  allSelectableTags,
  isSelectableTag,
  SelectableTag,
} from '../panel/models/InterfaceElement';
import './clickable.css';

console.log('Loaded content script');

const selectableElementTags = allSelectableTags;

// managing element clickability
let isClickable = false;
let stepId = '';
let validTags: SelectableTag[] = [];
let url = '';

const setupMessageListener = () => {
  chrome.runtime.onMessage.addListener((message: Message) => {
    switch (message.type) {
      case 'close_side_panel':
      case 'user_clicked_element':
        break;
      case 'set_clickable': {
        validTags = message.validTags;
        stepId = message.stepId;
        isClickable = true;
        url = message.url;
        updateClassList();
        break;
      }
      case 'set_focus': {
        console.log('received focussing message');
        const elementOuterHTML = message.element;

        document.querySelectorAll('*').forEach((element) => {
          if (element.outerHTML === elementOuterHTML) {
            console.log('found element to focus');
            element.classList.add('focussed-on');
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });
        break;
      }
      case 'unset_focus': {
        console.log('received focussing message');
        document.querySelectorAll('*').forEach((element) => {
          element.classList.remove('focussed-on');
        });
        break;
      }
      case 'system_click_element': {
        console.log('received click element message');
        const elementOuterHTML = message.element;

        document.querySelectorAll('button').forEach((element) => {
          if (element.outerHTML === elementOuterHTML) {
            console.log('found element to click');
            element.click();
          }
        });

        document.querySelectorAll('a').forEach((element) => {
          if (element.outerHTML === elementOuterHTML) {
            console.log('found element to click');
            element.click();
          }
        });
      }
    }
  });
};

const updateClassList = () => {
  selectableElementTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      if (!element) {
        continue;
      }
      if (
        isClickable &&
        isSelectableTag(element.tagName) &&
        validTags.includes(element.tagName)
      ) {
        element.classList.add('clickable');
      } else {
        element.classList.remove('clickable');
      }
    }
  });
};

const addClickListeners = () => {
  console.log('adding click listeners');
  selectableElementTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      if (!element) {
        continue;
      }
      element.addEventListener('click', () => {
        if (
          isClickable &&
          isSelectableTag(element.tagName) &&
          validTags.includes(element.tagName)
        ) {
          element.classList.remove('clickable');
          const message: ClickedElementMessage = {
            type: 'user_clicked_element',
            elementOuterHtml: element.outerHTML,
            elementTag: element.tagName,
            elementTextContent: element.textContent,
            stepId,
            url,
            newUrl: element.hasAttribute('href')
              ? (element as HTMLLinkElement).href
              : '',
          };
          chrome.runtime.sendMessage(message);
          isClickable = !isClickable;
          updateClassList();
        }
      });
    }
  });
};

setupMessageListener();
updateClassList();
addClickListeners();
