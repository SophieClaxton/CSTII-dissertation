import { PanelMessage, LoadedMessage } from '../common/message';
import {
  allSelectableTags,
  isSelectableTag,
  allInputTags,
} from '../panel/models/interfaceElement/selectableTag';
import { mapStepNodeToValidTags } from '../panel/models/interfaceElement/validTags';
import './clickable.css';
import { clickableClass, defaultLevelOfSupport } from './consts';
import { elementSatisfiesValidTags } from './elementUtils';
import { onSetFocus, onUnsetFocus } from './focusElement';
import { onUserClickElement } from './interactWithElement';
import {
  collectUserStruggleDataOnMouseMove,
  collectUserStruggleDataOnMouseDown,
  collectStruggleDataOnScroll,
} from './userSupport/collectStruggleEvidence';
import {
  detectStepOnClick,
  detectStepOnInput,
  detectStepOnScroll,
} from './userSupport/detectStep';
import { EditingState, SupportState } from './userSupport/state';
import {
  onStartSupport,
  onEndSupport,
  onReceiveNextPossibleSteps,
} from './userSupport/support';

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
  timeoutId: undefined,
  intervalId: undefined,
  levelOfSupport: defaultLevelOfSupport,
  nextPossibleSteps: [],
  nextStep: undefined,
  lastScrollPosition: { x: 0, y: 0 },
  systemScrolling: false,
};

const setupMessageListener = () => {
  chrome.runtime.onMessage.addListener((message: PanelMessage) => {
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
        return onSetFocus(message.element, supportState);
      }
      case 'unset_focus': {
        console.log('received focussing message');
        return onUnsetFocus();
      }
      case 'start_support': {
        console.log(`Received start support: ${message.levelOfSupport}`);
        return onStartSupport(supportState, message.levelOfSupport);
      }
      case 'end_support': {
        console.log('Received end support message');
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
    window.requestAnimationFrame(() => {
      collectStruggleDataOnScroll(supportState);
      detectStepOnScroll(supportState);
      ticking = false;
    });
    ticking = true;
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
        elementsWithInputListeners.add(element);
      }
    }
  });
};

setupMessageListener();
const loadedMessage: LoadedMessage = { type: 'loaded' };
chrome.runtime.sendMessage(loadedMessage).catch(() => undefined);

updateClassList();
addClickListeners();
addInputListeners();

const domObserver = new MutationObserver(() => {
  addClickListeners();
  addInputListeners();
});
domObserver.observe(document, { childList: true, subtree: true });
