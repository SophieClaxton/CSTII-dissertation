import { UserStruggleDataMessage } from '../../messaging/message';
import { ASTNodeType } from '../../panel/models/AST/AST';
import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { defaultLevelOfSupport } from '../consts';
import { setFocus } from '../elements/focusOnElement';
import { listenForInputChange, preDetectInputStep } from './detectStep';
import { SupportState } from './state';
import { LevelOfSupport } from '../../panel/models/UserSupport';
import { mapStepToSystemAction, onScrollStepComplete } from './doStep';

const sendUserStruggleData = (supportState: SupportState) => {
  supportState.userStruggleData.totalDistance = Math.log(
    supportState.userStruggleData.totalDistance,
  );
  supportState.userStruggleData.totalScrollDistance = Math.log(
    supportState.userStruggleData.totalScrollDistance,
  );
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
      10000,
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

const onScrollEnd = (
  levelOfSupport: Exclude<LevelOfSupport, 'text'>,
  step: ASTInstruction,
): ((element: Element, supportState: SupportState) => void) => {
  switch (levelOfSupport) {
    case 'overlay':
      if (step.type === ASTNodeType.ScrollTo) {
        return onScrollStepComplete(step);
      }
      return (_element: Element, _supportState: SupportState) => {};
    case 'click':
      return mapStepToSystemAction[step.type](step);
  }
};

const supportNextStep = (
  supportState: SupportState,
  levelOfSupport: Exclude<LevelOfSupport, 'text'>,
) => {
  const [nextStep] = supportState.nextPossibleSteps;
  console.log(nextStep);
  if (nextStep && nextStep.type != ASTNodeType.UserDecision) {
    setFocus(
      nextStep.element,
      supportState,
      true,
      onScrollEnd(levelOfSupport, nextStep),
    );
  }
};

const onReceiveNextPossibleSteps = (
  supportState: SupportState,
  nextPossibleSteps: ASTInstruction[],
) => {
  supportState.nextPossibleSteps = nextPossibleSteps;
  const levelOfSupport = supportState.levelOfSupport;

  // Check if the next step has already been completed if its an input step
  preDetectInputStep(nextPossibleSteps.at(0), supportState);
  listenForInputChange(nextPossibleSteps.at(0), supportState);

  // Provide no further support if level of support is text
  if (levelOfSupport === 'text') {
    return;
  }

  supportState.timeoutId = setTimeout(() => {
    supportNextStep(supportState, levelOfSupport);
  }, 1000);
};

export { onStartSupport, onEndSupport, onReceiveNextPossibleSteps };
