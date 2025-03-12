import stringSimilarity from 'string-similarity-js';
import { StepCompletedMessage } from '../../common/message';
import { ASTNodeType } from '../../panel/models/AST/AST';
import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { unsetFocus } from '../elements/focusOnElement';
import { SupportState } from './state';
import { findElement } from '../elements/elementUtils';
import { elementsMatch } from '../elements/matchElements';

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
  unsetFocus();
};

const detectStepOnScroll = (supportState: SupportState) => {
  if (supportState.collectStruggleData && !supportState.systemScrolling) {
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step) => {
      if (step.type === ASTNodeType.ScrollTo) {
        const element = findElement(step.element);
        if (element && isVisible(element)) {
          console.log('Detected on scroll');
          console.log(step);
          sendDetectionMessage(supportState, step);
          return;
        }
      }
    });
  }
};

const detectStepOnClick = (element: Element, supportState: SupportState) => {
  if (supportState.collectStruggleData) {
    const steps = [...supportState.nextPossibleSteps];
    steps.forEach((step) => {
      if (
        (step.type === ASTNodeType.Click || step.type === ASTNodeType.Follow) &&
        elementsMatch(element, step.element)
      ) {
        console.log('Detected on click');
        console.log(step);
        sendDetectionMessage(supportState, step);
      }
    });
  }
};

const detectWriteStep = (
  step: ASTInstruction,
  element: Element,
  supportState: SupportState,
) => {
  if (step.type === ASTNodeType.Write && elementsMatch(element, step.element)) {
    console.log('Detected write');
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
};

const detectSelectStep = (
  step: ASTInstruction,
  element: Element,
  supportState: SupportState,
) => {
  if (step.type !== ASTNodeType.Select) {
    return;
  }
  console.log('Actual element:', element.outerHTML);
  console.log('Step element', step.element.outerHTML);
  if (elementsMatch(element, step.element)) {
    console.log('Detected select');
    const selectElement = element as HTMLSelectElement;
    console.log(selectElement.value);
    if (
      selectElement.options[selectElement.selectedIndex].value ===
      step.option.value
    ) {
      console.log(step);
      sendDetectionMessage(supportState, step);
    }
  }
};

const detectCheckStep = (
  step: ASTInstruction,
  element: Element,
  supportState: SupportState,
) => {
  if (step.type !== ASTNodeType.Check) {
    return;
  }
  console.log('Actual element:', element.outerHTML);
  console.log('Step element', step.element.outerHTML);
  if (elementsMatch(element, step.element)) {
    console.log('Detected check');
    const checkElement = element as HTMLInputElement;
    if (checkElement.checked === step.isChecked) {
      sendDetectionMessage(supportState, step);
    }
  }
};

const detectStepOnInput = (element: Element, supportState: SupportState) => {
  if (!supportState.collectStruggleData) {
    return;
  }
  const steps = [...supportState.nextPossibleSteps];
  steps.forEach((step) => {
    console.log('detecting step on input');
    console.log(step);
    switch (step.type) {
      case ASTNodeType.Write:
        return detectWriteStep(step, element, supportState);
      case ASTNodeType.Select:
        return detectSelectStep(step, element, supportState);
      case ASTNodeType.Check:
        return detectCheckStep(step, element, supportState);
    }
  });
};

const preDetectInputStep = (
  step: ASTInstruction | undefined,
  supportState: SupportState,
) => {
  if (
    step &&
    ((step.type === ASTNodeType.Write && step.isExact) ||
      step.type === ASTNodeType.Select ||
      step.type === ASTNodeType.Check)
  ) {
    const element = findElement(step.element);
    if (element) {
      detectStepOnInput(element, supportState);
    }
  }
};

export {
  detectStepOnScroll,
  detectStepOnClick,
  detectStepOnInput,
  preDetectInputStep,
  sendDetectionMessage,
};
