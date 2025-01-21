import { PanelMessage, LoadedMessage } from '../common/message';
import {
  allSelectableTags,
  isSelectableTag,
} from '../panel/models/InterfaceElement';
import './clickable.css';
import {
  EditingState,
  onEndSupport,
  onStartSupport,
  SupportState,
} from './state';
import {
  collectStruggleDataOnScroll,
  collectUserStruggleDataOnMouseDown,
  collectUserStruggleDataOnMouseMove,
} from './collectUserStruggleEvidence';
import { detectStepOnClick, detectStepOnScroll } from './detectStep';
import { defaultLevelOfSupport } from './consts';
import { onSetFocus, onUnsetFocus } from './focusElement';
import {
  onSystemClickElement,
  onUserClickElement,
} from './interactWithElement';

console.log('Loaded content script');

let editingState: EditingState = {
  isClickable: false,
  stepId: '',
  validTags: [],
  url: '',
};

const supportState: SupportState = {
  collectStruggleData: false,
  userStruggleData: {
    totalDistance: 0,
    numMouseClicks: 0,
    totalScrollDistance: 0,
  },
  intervalId: undefined,
  levelOfSupport: defaultLevelOfSupport,
  nextPossibleSteps: [],
  lastScrollPosition: { x: 0, y: 0 },
};

const setupMessageListener = () => {
  chrome.runtime.onMessage.addListener((message: PanelMessage) => {
    switch (message.type) {
      case 'set_clickable': {
        editingState = { isClickable: true, ...message };
        updateClassList();
        break;
      }
      case 'set_focus': {
        console.log('received focussing message');
        onSetFocus(message);
        break;
      }
      case 'unset_focus': {
        console.log('received focussing message');
        onUnsetFocus();
        break;
      }
      case 'system_click_element': {
        console.log('received click element message');
        onSystemClickElement(message);
        break;
      }
      case 'start_support': {
        console.log(
          `Received start support with support: ${message.levelOfSupport}`,
        );
        onStartSupport(supportState, message);
        break;
      }
      case 'end_support': {
        console.log('Received end support message');
        onEndSupport(supportState);
        break;
      }
      case 'next_possible_steps': {
        console.log('Received next possible steps:');
        console.log(message.steps);
        supportState.nextPossibleSteps = message.steps;
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
  allSelectableTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (const element of elements) {
      if (
        editingState.isClickable &&
        isSelectableTag(element.tagName) &&
        editingState.validTags.includes(element.tagName)
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
  allSelectableTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (const element of elements) {
      element.addEventListener('click', () => {
        onUserClickElement(editingState, element, updateClassList);
        detectStepOnClick(element, supportState);
      });
    }
  });
};

document.onmousemove = collectUserStruggleDataOnMouseMove(supportState);
document.onmousedown = collectUserStruggleDataOnMouseDown(supportState);

let ticking = false;
document.onscroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      collectStruggleDataOnScroll(supportState);
      detectStepOnScroll(supportState);
      ticking = false;
    });
    ticking = true;
  }
};

setupMessageListener();
const loadedMessage: LoadedMessage = { type: 'loaded' };
chrome.runtime.sendMessage(loadedMessage).catch(() => undefined);

updateClassList();
addClickListeners();
