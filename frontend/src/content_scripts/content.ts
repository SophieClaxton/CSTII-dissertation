import {
  UserClickedElementMessage,
  PanelMessage,
  UserStruggleDataMessage,
  StepCompletedMessage,
  LoadedMessage,
} from '../common/message';
import { ASTNodeType } from '../panel/models/AST/AST';
import {
  allSelectableTags,
  isSelectableTag,
} from '../panel/models/InterfaceElement';
import './clickable.css';
import { EditingState, SupportState } from './state';
import { stringSimilarity } from 'string-similarity-js';

console.log('Loaded content script');

const selectableElementTags = allSelectableTags;
const similarityThreshold = 0.975;

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
        document.querySelectorAll('*').forEach((element) => {
          if (
            stringSimilarity(element.outerHTML, message.element) >
            similarityThreshold
          ) {
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
        document.querySelectorAll('button').forEach((element) => {
          if (
            stringSimilarity(element.outerHTML, message.element) >
            similarityThreshold
          ) {
            console.log('found element to click');
            element.click();
          }
        });

        document.querySelectorAll('a').forEach((element) => {
          if (
            stringSimilarity(element.outerHTML, message.element) >
            similarityThreshold
          ) {
            console.log('found element to click');
            element.click();
          }
        });
        break;
      }
      case 'start_support': {
        console.log('Received start support message');
        supportState.collectStruggleData = true;
        supportState.intervalId = setInterval(() => {
          const message: UserStruggleDataMessage = {
            type: 'user_struggle_data',
            userStruggleData: supportState.userStruggleData,
          };

          chrome.runtime.sendMessage(message).catch(() => {
            supportState.collectStruggleData = false;
            clearInterval(supportState.intervalId);
          });
          supportState.userStruggleData = {
            totalDistance: 0,
            numMouseClicks: 0,
            totalScrollDistance: 0,
          };
        }, 5000);
        break;
      }
      case 'end_support': {
        console.log('Received end support message');
        supportState.collectStruggleData = false;
        clearInterval(supportState.intervalId);
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
  selectableElementTags.forEach((tag) => {
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
  selectableElementTags.forEach((tag) => {
    const elements = document.getElementsByTagName(tag);
    for (const element of elements) {
      element.addEventListener('click', () => {
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

        if (supportState.collectStruggleData) {
          const steps = [...supportState.nextPossibleSteps];
          steps.forEach((step, index) => {
            if (
              (step.type === ASTNodeType.Click ||
                step.type === ASTNodeType.Follow) &&
              step.element.tag === element.tagName &&
              stringSimilarity(element.outerHTML, step.element.outerHTML) >
                similarityThreshold
            ) {
              console.log('Step completed');
              const message: StepCompletedMessage = {
                type: 'step_completed',
                step,
                index,
              };

              chrome.runtime.sendMessage(message);
              supportState.nextPossibleSteps =
                supportState.nextPossibleSteps.filter(
                  (_, stepIndex) => stepIndex != index,
                );
            }
          });
        }
      });
    }
  });
};

document.onmousemove = (ev: MouseEvent) => {
  if (supportState.collectStruggleData) {
    supportState.userStruggleData.totalDistance += Math.sqrt(
      Math.pow(ev.movementX, 2) + Math.pow(ev.movementY, 2),
    );
  }
};

document.onmousedown = () => {
  if (supportState.collectStruggleData) {
    supportState.userStruggleData.numMouseClicks += 1;
  }
};

const isVisible = (element: Element): boolean => {
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.top > 0 &&
    elementRect.bottom < window.innerHeight &&
    elementRect.left > 0 &&
    elementRect.right < window.innerWidth
  );
};

let ticking = false;

document.onscroll = () => {
  if (supportState.collectStruggleData && !ticking) {
    window.requestAnimationFrame(() => {
      supportState.userStruggleData.totalScrollDistance +=
        Math.abs(window.scrollX - supportState.lastScrollPosition.x) +
        Math.abs(window.scrollY - supportState.lastScrollPosition.y);
      supportState.lastScrollPosition = {
        x: window.scrollX,
        y: window.scrollY,
      };

      const steps = [...supportState.nextPossibleSteps];
      steps.forEach((step, index) => {
        if (step.type === ASTNodeType.ScrollTo) {
          for (const element of document.getElementsByTagName(
            step.element.tag,
          )) {
            if (
              element.outerHTML === step.element.outerHTML &&
              isVisible(element)
            ) {
              console.log('Step completed');
              const message: StepCompletedMessage = {
                type: 'step_completed',
                step,
                index,
              };

              chrome.runtime.sendMessage(message);
              supportState.nextPossibleSteps =
                supportState.nextPossibleSteps.filter(
                  (_, stepIndex) => stepIndex != index,
                );
            }
          }
        }
      });
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
