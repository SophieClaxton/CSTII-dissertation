import { StepCompletedMessage } from '../../common/message';
import { ASTNodeType } from '../../panel/models/AST/AST';
import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { getElementFromId, elementsMatch } from '../elementUtils';
import { onUnsetFocus } from '../focusElement';
import { SupportState } from './state';

const isVisible = (element: Element): boolean => {
  const elementRect = element.getBoundingClientRect();
  const yOffset = 50;
  const xOffset = 25;
  return (
    elementRect.top > yOffset &&
    elementRect.bottom < window.innerHeight - yOffset &&
    elementRect.left > xOffset &&
    elementRect.right < window.innerWidth - xOffset
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
  console.log(`Clicked element: ${element.textContent}`);
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

export { detectStepOnScroll, detectStepOnClick, sendDetectionMessage };
