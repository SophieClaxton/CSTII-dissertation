import stringSimilarity from 'string-similarity-js';
import { StepCompletedMessage } from '../common/message';
import { ASTNodeType } from '../panel/models/AST/AST';
import { SupportState } from './state';
import { similarityThreshold } from './consts';

const isVisible = (element: Element): boolean => {
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.top > 0 &&
    elementRect.bottom < window.innerHeight &&
    elementRect.left > 0 &&
    elementRect.right < window.innerWidth
  );
};

const detectStepOnScroll = (supportState: SupportState) => {
  if (supportState.collectStruggleData) {
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step, index) => {
      if (step.type === ASTNodeType.ScrollTo) {
        for (const element of document.getElementsByTagName(step.element.tag)) {
          if (
            stringSimilarity(element.outerHTML, step.element.outerHTML) >
              similarityThreshold &&
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
  }
};

const detectStepOnClick = (element: Element, supportState: SupportState) => {
  if (supportState.collectStruggleData) {
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step, index) => {
      if (
        (step.type === ASTNodeType.Click || step.type === ASTNodeType.Follow) &&
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
        supportState.nextPossibleSteps = supportState.nextPossibleSteps.filter(
          (_, stepIndex) => stepIndex != index,
        );
      }
    });
  }
};

export { detectStepOnScroll, detectStepOnClick };
