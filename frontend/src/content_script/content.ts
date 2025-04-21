import { PanelMessage, LoadedMessage } from '../messaging/message';
import {
  allSelectableTags,
  isSelectableTag,
  allInputTags,
} from '../side_panel/models/interface_element/selectableTag';
import { mapStepNodeToValidTags } from '../side_panel/models/interface_element/validTags';
import './clickable.css';
import { clickableClass, defaultLevelOfSupport } from './consts';
import { elementSatisfiesValidTags } from './elements/elementUtils';
import { setFocus, unsetFocus } from './elements/focusOnElement';
import { onUserClickElement } from './elements/interactWithElement';
import {
  collectUserStruggleDataOnMouseMove,
  collectUserStruggleDataOnMouseDown,
  collectStruggleDataOnScroll,
} from './user_support/collectStruggleEvidence';
import {
  detectStepOnClick,
  detectStepOnInput,
  detectStepOnScroll,
} from './user_support/detectStep';
import { EditingState, SupportState } from './user_support/state';
import {
  onStartSupport,
  onEndSupport,
  onReceiveNextPossibleSteps,
} from './user_support/support';

console.log('Loaded content script');
const loadedMessage: LoadedMessage = { type: 'loaded' };
let loadedMessageSent = false;

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
  timeoutId: undefined,
  intervalId: undefined,
  levelOfSupport: defaultLevelOfSupport,
  nextPossibleSteps: [],
  lastScrollPosition: { x: 0, y: 0 },
  systemScrolling: false,
};

const setupMessageListener = () => {
  chrome.runtime.onMessage.addListener((message: PanelMessage) => {
    if (!loadedMessageSent) {
      chrome.runtime
        .sendMessage(loadedMessage)
        .then(() => {
          console.log('Send loaded message');
          loadedMessageSent = true;
        })
        .catch(() => console.log('Failed to send loaded message'));
    }
    switch (message.type) {
      case 'set_clickable': {
        const { stepId, stepType, url } = message;
        editingState = {
          isClickable: true,
          stepId,
          url,
          validTags: mapStepNodeToValidTags[stepType],
        };
        updateClassList();
        break;
      }
      case 'set_focus': {
        console.log('received focussing message');
        return setFocus(message.element, supportState);
      }
      case 'unset_focus': {
        console.log('received focussing message');
        return unsetFocus();
      }
      case 'start_support': {
        console.log(`Received start support: ${message.levelOfSupport}`);
        return onStartSupport(supportState, message.levelOfSupport);
      }
      case 'end_support': {
        console.log('Received end support message');
        unsetFocus();
        return onEndSupport(supportState);
      }
      case 'next_possible_steps': {
        console.log('Received next possible steps');
        return onReceiveNextPossibleSteps(supportState, message.steps);
      }
      default: {
        const e: never = message;
        return e;
      }
    }
  });
};

document.onmousemove = collectUserStruggleDataOnMouseMove(supportState);
document.onmousedown = collectUserStruggleDataOnMouseDown(supportState);

let ticking = false;
document.onscroll = () => {
  if (!ticking) {
    ticking = true;
    setTimeout(() => {
      collectStruggleDataOnScroll(supportState);
      detectStepOnScroll(supportState);
      ticking = false;
    }, 33);
  }
};

const updateClassList = () => {
  allSelectableTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (const element of elements) {
      if (
        editingState.isClickable &&
        isSelectableTag(element.tagName) &&
        elementSatisfiesValidTags(element, editingState.validTags)
      ) {
        element.classList.add(clickableClass);
      } else {
        element.classList.remove(clickableClass);
      }
    }
  });
};

const elementsWithClickListeners = new WeakSet();
const addClickListeners = () => {
  allSelectableTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (const element of elements) {
      if (!elementsWithClickListeners.has(element)) {
        element.addEventListener('click', () => {
          onUserClickElement(editingState, element, updateClassList);
          detectStepOnClick(element, supportState);
        });
        elementsWithClickListeners.add(element);
      }
    }
  });
};

const elementsWithInputListeners = new WeakSet();
const addInputListeners = () => {
  console.log('add input listeners');
  allInputTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (const element of elements) {
      if (!elementsWithInputListeners.has(element)) {
        element.addEventListener('input', () => {
          detectStepOnInput(element, supportState);
        });
        element.addEventListener('change', () => {
          detectStepOnInput(element, supportState);
        });
        elementsWithInputListeners.add(element);
      }
    }
  });
};

setupMessageListener();
chrome.runtime
  .sendMessage(loadedMessage)
  .then(() => {
    console.log('Send loaded message');
    loadedMessageSent = true;
  })
  .catch(() => console.log('Failed to send loaded message'));

updateClassList();
addClickListeners();
addInputListeners();

const domObserver = new MutationObserver(() => {
  addClickListeners();
  addInputListeners();
});
domObserver.observe(document, { childList: true, subtree: true });
