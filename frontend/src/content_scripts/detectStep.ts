import { StepCompletedMessage } from '../common/message';
import { ASTNodeType } from '../panel/models/AST/AST';
import { SupportState } from './state';
import { elementsMatch, getElementFromId } from './elementUtils';
import { ASTInstruction } from '../panel/models/AST/Instruction';

const isVisible = (element: Element): boolean => {
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.top > 0 &&
    elementRect.bottom < window.innerHeight &&
    elementRect.left > 0 &&
    elementRect.right < window.innerWidth
  );
};

const sendDetectionMessage = (
  supportState: SupportState,
  step: ASTInstruction,
) => {
  console.log('Sending Detection Message for step');
  console.log(step);
  const message: StepCompletedMessage = {
    type: 'step_completed',
    step,
  };
  chrome.runtime.sendMessage(message);
  supportState.nextPossibleSteps = supportState.nextPossibleSteps.filter(
    (otherStep) => otherStep.stepNumber != step.stepNumber,
  );
};

// TODO: detect with focussed-on class

const detectStepOnScroll = (supportState: SupportState) => {
  if (supportState.collectStruggleData) {
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
          if (
            elementsMatch(element, step.element.outerHTML) &&
            isVisible(element)
          ) {
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
  if (supportState.collectStruggleData) {
    console.log(element.outerHTML);
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step) => {
      if (
        (step.type === ASTNodeType.Click || step.type === ASTNodeType.Follow) &&
        step.element.tag === element.tagName &&
        elementsMatch(element, step.element.outerHTML)
      ) {
        console.log('Detected on click');
        console.log(step);
        sendDetectionMessage(supportState, step);
      }
    });
  }
};

export { detectStepOnScroll, detectStepOnClick, sendDetectionMessage };
