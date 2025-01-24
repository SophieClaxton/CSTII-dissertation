import { UserStruggleDataMessage } from '../common/message';
import { ASTNodeType } from '../panel/models/AST/AST';
import { ASTInstruction } from '../panel/models/AST/Instruction';
import { SelectableTag } from '../panel/models/InterfaceElement';
import { LevelOfSupport } from '../panel/support/script_support/userStruggleSupport/userSupportMII';
import { defaultLevelOfSupport } from './consts';
import { sendDetectionMessage } from './detectStep';
import { onSetFocus, onUnsetFocus } from './focusElement';
import { onSystemClickElement } from './interactWithElement';

interface EditingState {
  isClickable: boolean;
  stepId: string;
  validTags: SelectableTag[];
  url: string;
}

interface SupportState {
  collectStruggleData: boolean;
  userStruggleData: {
    totalDistance: number;
    numMouseClicks: number;
    totalScrollDistance: number;
  };
  intervalId: NodeJS.Timeout | undefined;
  timeoutId: NodeJS.Timeout | undefined;
  levelOfSupport: LevelOfSupport;
  nextPossibleSteps: ASTInstruction[];
  lastScrollPosition: { x: number; y: number };
}

const onStartSupport = (
  supportState: SupportState,
  levelOfSupport: LevelOfSupport,
) => {
  supportState.collectStruggleData = true;
  // const LoSChanged = supportState.levelOfSupport != levelOfSupport;
  // if (LoSChanged) {
  //   onReceiveNextPossibleSteps(supportState, supportState.nextPossibleSteps);
  // }
  supportState.levelOfSupport = levelOfSupport;
  onReceiveNextPossibleSteps(supportState, supportState.nextPossibleSteps);
  if (!supportState.intervalId) {
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
  }
};

const onEndSupport = (supportState: SupportState) => {
  supportState.collectStruggleData = false;
  supportState.levelOfSupport = defaultLevelOfSupport;
  clearInterval(supportState.intervalId);
  clearTimeout(supportState.timeoutId);
  // FIX: interval carrying on
};

const onReceiveNextPossibleSteps = (
  supportState: SupportState,
  nextPossibleSteps: ASTInstruction[],
) => {
  supportState.nextPossibleSteps = nextPossibleSteps;

  const [stepToHelpWith] = supportState.nextPossibleSteps;
  console.log(stepToHelpWith);
  if (stepToHelpWith && stepToHelpWith.type != ASTNodeType.UserDecision) {
    if (supportState.levelOfSupport === 'overlay') {
      // console.log('Trying to focus on that element');
      const focussedOnElement = onSetFocus(
        stepToHelpWith.element.tag,
        stepToHelpWith.element.outerHTML,
      );
      // console.log(`Element was focussed: ${focussedOnElement}`);
      if (focussedOnElement && stepToHelpWith.type === ASTNodeType.ScrollTo) {
        // TODO: make timeout proportional to reading time
        supportState.timeoutId = setTimeout(() => {
          sendDetectionMessage(supportState, stepToHelpWith);
          onUnsetFocus();
        }, 6000);
      }
    } else if (supportState.levelOfSupport === 'click') {
      // console.log('Trying to complete action for user');
      const focussedOnElement = onSetFocus(
        stepToHelpWith.element.tag,
        stepToHelpWith.element.outerHTML,
        false,
      );
      if (focussedOnElement && stepToHelpWith.type === ASTNodeType.ScrollTo) {
        // supportState.timeoutId = setTimeout(
        //   () => sendDetectionMessage(supportState, stepToHelpWith, 0),
        //   6000,
        // );
      } else if (
        stepToHelpWith.type === ASTNodeType.Click ||
        stepToHelpWith.type === ASTNodeType.Follow
      ) {
        supportState.timeoutId = setTimeout(() => {
          onSystemClickElement(stepToHelpWith.element.outerHTML);
          // sendDetectionMessage(supportState, stepToHelpWith, 0);
        }, 6000);
      }
    }
  }
};

export type { EditingState, SupportState };
export { onStartSupport, onEndSupport, onReceiveNextPossibleSteps };
