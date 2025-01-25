import { isHTMLElement } from '@dnd-kit/utilities';
import { UserStruggleDataMessage } from '../../common/message';
import { ASTNodeType } from '../../panel/models/AST/AST';
import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { defaultLevelOfSupport } from '../consts';
import { onSetFocus } from '../focusElement';
import { sendDetectionMessage } from './detectStep';
import { SupportState } from './state';
import { LevelOfSupport } from '../../panel/support/script_support/userStruggleSupport/userSupportMII';

const sendUserStruggleData = (supportState: SupportState) => {
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
};

const onStartSupport = (
  supportState: SupportState,
  levelOfSupport: LevelOfSupport,
) => {
  supportState.collectStruggleData = true;
  supportState.levelOfSupport = levelOfSupport;
  clearTimeout(supportState.timeoutId);
  onReceiveNextPossibleSteps(supportState, supportState.nextPossibleSteps);

  if (!supportState.intervalId) {
    supportState.intervalId = setInterval(
      () => sendUserStruggleData(supportState),
      5000,
    );
  }
};

const onEndSupport = (supportState: SupportState) => {
  supportState.collectStruggleData = false;
  supportState.levelOfSupport = defaultLevelOfSupport;
  clearInterval(supportState.intervalId);
  clearTimeout(supportState.timeoutId);
  supportState.intervalId = undefined;
  supportState.timeoutId = undefined;
};

const onScrollStepComplete =
  (step: ASTInstruction) => (_element: Element, supportState: SupportState) => {
    supportState.timeoutId = setTimeout(() => {
      supportState.nextStep = undefined;
      sendDetectionMessage(supportState, step);
    }, 3000);
  };

const onClickStepComplete =
  (_step: ASTInstruction) => (element: Element, supportState: SupportState) => {
    supportState.timeoutId = setTimeout(() => {
      if (isHTMLElement(element)) {
        supportState.nextStep = undefined;
        element.click();
      }
    }, 2000);
  };

const onFocusComplete = (
  levelOfSupport: Exclude<LevelOfSupport, 'text'>,
  step: ASTInstruction,
): ((element: Element, supportState: SupportState) => void) => {
  switch (levelOfSupport) {
    case 'overlay':
      if (step.type === ASTNodeType.ScrollTo) {
        return onScrollStepComplete(step);
      }
      return (_element: Element, supportState: SupportState) =>
        (supportState.nextStep = undefined);
    case 'click':
      if (step.type === ASTNodeType.Click || step.type === ASTNodeType.Follow) {
        return onClickStepComplete(step);
      } else if (step.type === ASTNodeType.ScrollTo) {
        return onScrollStepComplete(step);
      }
      return (_element: Element, supportState: SupportState) =>
        (supportState.nextStep = undefined);
  }
};

const onReceiveNextPossibleSteps = (
  supportState: SupportState,
  nextPossibleSteps: ASTInstruction[],
) => {
  supportState.nextPossibleSteps = nextPossibleSteps;
  if (supportState.levelOfSupport === 'text') {
    return;
  }

  if (!supportState.nextStep) {
    const [stepToHelpWith] = supportState.nextPossibleSteps;
    supportState.nextStep = stepToHelpWith;
    console.log('Setting next step');
  }
  const levelOfSupport = supportState.levelOfSupport;

  supportState.timeoutId = setTimeout(() => {
    const nextStep = supportState.nextStep;
    console.log(nextStep);
    if (nextStep && nextStep.type != ASTNodeType.UserDecision) {
      onSetFocus(
        nextStep.element,
        supportState,
        supportState.levelOfSupport === 'overlay',
        onFocusComplete(levelOfSupport, nextStep),
      );
    }
  }, 1000);
};

export { onStartSupport, onEndSupport, onReceiveNextPossibleSteps };
