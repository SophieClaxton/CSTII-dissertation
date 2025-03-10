import stringSimilarity from 'string-similarity-js';
import { StepCompletedMessage } from '../../common/message';
import { ASTNodeType } from '../../panel/models/AST/AST';
import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { getElementFromId, elementsMatch } from '../elementUtils';
import { onUnsetFocus } from '../focusElement';
import { SupportState } from './state';

const isVisible = (element: Element): boolean => {
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.top > 0 &&
    elementRect.bottom < window.innerHeight - 0 &&
    elementRect.left > 0 &&
    elementRect.right < window.innerWidth - 0
  );
};

const sendDetectionMessage = (
  supportState: SupportState,
  step: ASTInstruction,
) => {
  console.log(`Sending Detection Message for stepNumber ${step.stepNumber}`);
  const message: StepCompletedMessage = {
    type: 'step_completed',
    step,
  };
  chrome.runtime.sendMessage(message);
  supportState.nextPossibleSteps = supportState.nextPossibleSteps.filter(
    (otherStep) => otherStep.stepNumber != step.stepNumber,
  );
  onUnsetFocus();
};

const detectStepOnScroll = (supportState: SupportState) => {
  if (supportState.collectStruggleData && !supportState.systemScrolling) {
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step) => {
      if (step.type === ASTNodeType.ScrollTo) {
        const elementFromId = getElementFromId(step.element.outerHTML);
        if (elementFromId && isVisible(elementFromId)) {
          console.log('Detected on scroll');
          console.log(step);
          sendDetectionMessage(supportState, step);
          return;
        }
        for (const element of document.getElementsByTagName(step.element.tag)) {
          if (elementsMatch(element, step.element) && isVisible(element)) {
            console.log('Detected on scroll');
            console.log(step);
            sendDetectionMessage(supportState, step);
          }
        }
      }
    });
  }
};

const detectStepOnClick = (element: Element, supportState: SupportState) => {
  // console.log(`Clicked element: ${element.textContent}`);
  if (supportState.collectStruggleData) {
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step) => {
      if (
        (step.type === ASTNodeType.Click || step.type === ASTNodeType.Follow) &&
        step.element.tag === element.tagName &&
        elementsMatch(element, step.element)
      ) {
        console.log('Detected on click');
        console.log(step);
        sendDetectionMessage(supportState, step);
      }
    });
  }
};

const detectStepOnInput = (element: Element, supportState: SupportState) => {
  if (!supportState.collectStruggleData) {
    return;
  }
  const steps = [...supportState.nextPossibleSteps];
  steps.forEach((step) => {
    if (
      (step.type === ASTNodeType.Write &&
        elementsMatch(element, step.element)) ||
      step.type === ASTNodeType.Select
    ) {
      console.log('Detected on input');
      if (step.type === ASTNodeType.Write) {
        const writeElement = element as HTMLInputElement | HTMLTextAreaElement;
        if (step.isExact) {
          if (stringSimilarity(writeElement.value, step.text) > 0.95) {
            console.log(step);
            sendDetectionMessage(supportState, step);
          }
        } else {
          if (writeElement.value !== '') {
            console.log(step);
            sendDetectionMessage(supportState, step);
          }
        }
      }
    }
  });
};

export {
  detectStepOnScroll,
  detectStepOnClick,
  detectStepOnInput,
  sendDetectionMessage,
};
