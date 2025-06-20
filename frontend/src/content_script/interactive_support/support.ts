import { InteractionDataMessage } from '../../messaging/message';
import { ASTNodeType } from '../../side_panel/models/AST/AST';
import { ASTInstruction } from '../../side_panel/models/AST/Instruction';
import { defaultLevelOfSupport, StruggleEvidenceDuration } from '../consts';
import { setFocus } from '../elements/focusOnElement';
import { listenForInputChange, preDetectInputStep } from './detectStep';
import { SupportState } from './state';
import { LevelOfSupport } from '../../side_panel/models/support_and_MII/UserSupport';
import { mapStepToSystemAction, onScrollStepComplete } from './doStep';

const sendInteractionData = (supportState: SupportState) => {
  supportState.interactionData.totalDistance = Math.log(
    supportState.interactionData.totalDistance,
  );
  supportState.interactionData.totalScrollDistance = Math.log(
    supportState.interactionData.totalScrollDistance,
  );
  const message: InteractionDataMessage = {
    type: 'interaction_data',
    interactionData: supportState.interactionData,
  };

  chrome.runtime.sendMessage(message).catch(() => {
    supportState.collectInteractionData = false;
    clearInterval(supportState.intervalId);
  });
  supportState.interactionData = {
    totalDistance: 0,
    numMouseClicks: 0,
    totalScrollDistance: 0,
  };
};

const onStartSupport = (
  supportState: SupportState,
  levelOfSupport: LevelOfSupport,
) => {
  supportState.collectInteractionData = true;
  supportState.levelOfSupport = levelOfSupport;
  clearTimeout(supportState.timeoutId);
  onReceiveNextPossibleSteps(supportState, supportState.nextPossibleSteps);

  if (!supportState.intervalId) {
    supportState.intervalId = setInterval(
      () => sendInteractionData(supportState),
      StruggleEvidenceDuration,
    );
  }
};

const onEndSupport = (supportState: SupportState) => {
  supportState.collectInteractionData = false;
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
    case 'hints':
      if (step.type === ASTNodeType.ScrollTo) {
        return onScrollStepComplete(step);
      }
      return (_element: Element, _supportState: SupportState) => {};
    case 'auto':
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
