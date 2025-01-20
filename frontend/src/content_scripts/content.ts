import {
  UserClickedElementMessage,
  PanelMessage,
  UserStruggleData,
  UserStruggleDataMessage,
} from '../common/message';
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
let collectUserStruggleData = false;
let userStruggleData: UserStruggleData = {
  totalDistance: 0,
  numMouseClicks: 0,
};
let intervalId: NodeJS.Timeout | undefined = undefined;

const setupMessageListener = () => {
  chrome.runtime.onMessage.addListener((message: PanelMessage) => {
    switch (message.type) {
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
        break;
      }
      case 'start_support': {
        collectUserStruggleData = true;
        intervalId = setInterval(() => {
          const message: UserStruggleDataMessage = {
            type: 'user_struggle_data',
            userStruggleData: userStruggleData,
          };

          chrome.runtime.sendMessage(message).catch(() => {
            collectUserStruggleData = false;
            clearInterval(intervalId);
          });
          userStruggleData = { totalDistance: 0, numMouseClicks: 0 };
        }, 5000);
        break;
      }
      case 'end_support': {
        collectUserStruggleData = false;
        clearInterval(intervalId);
        break;
      }
      default: {
        const e: never = message;
        return e;
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
          const message: UserClickedElementMessage = {
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

document.onmousemove = (ev: MouseEvent) => {
  if (collectUserStruggleData) {
    userStruggleData = {
      ...userStruggleData,
      totalDistance:
        userStruggleData.totalDistance +
        Math.sqrt(Math.pow(ev.movementX, 2) + Math.pow(ev.movementY, 2)),
    };
  }
};

document.onmousedown = () => {
  if (collectUserStruggleData) {
    userStruggleData = {
      ...userStruggleData,
      numMouseClicks: userStruggleData.numMouseClicks + 1,
    };
  }
};

setupMessageListener();
updateClassList();
addClickListeners();
