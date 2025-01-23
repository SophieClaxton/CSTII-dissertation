import { StepCompletedMessage } from '../common/message';
import { ASTNodeType, ASTStepNodeInfo } from '../panel/models/AST/AST';
import { SupportState } from './state';
import { elementsMatch } from './elementUtils';

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
  step: ASTStepNodeInfo,
  index: number,
) => {
  console.log('Sending Detection Message for step');
  console.log(step);
  const message: StepCompletedMessage = {
    type: 'step_completed',
    step,
    index,
  };
  chrome.runtime.sendMessage(message);
  supportState.nextPossibleSteps = supportState.nextPossibleSteps.filter(
    (_, stepIndex) => stepIndex != index,
  );
};

// TODO: detect with focussed-on class

const detectStepOnScroll = (supportState: SupportState) => {
  if (supportState.collectStruggleData) {
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step, index) => {
      if (step.type === ASTNodeType.ScrollTo) {
        for (const element of document.getElementsByTagName(step.element.tag)) {
          if (
            elementsMatch(element, step.element.outerHTML) &&
            isVisible(element)
          ) {
            console.log('Detected on scroll');
            console.log(step);
            sendDetectionMessage(supportState, step, index);
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
    steps.forEach((step, index) => {
      if (
        (step.type === ASTNodeType.Click || step.type === ASTNodeType.Follow) &&
        step.element.tag === element.tagName &&
        elementsMatch(element, step.element.outerHTML)
      ) {
        console.log('Detected on click');
        console.log(step);
        sendDetectionMessage(supportState, step, index);
      }
    });
  }
};

export { detectStepOnScroll, detectStepOnClick, sendDetectionMessage };
