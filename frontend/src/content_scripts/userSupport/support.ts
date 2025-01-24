import { UserStruggleDataMessage } from '../../common/message';
import { ASTNodeType } from '../../panel/models/AST/AST';
import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { LevelOfSupport } from '../../panel/support/script_support/userStruggleSupport/userSupportMII';
import { defaultLevelOfSupport } from '../consts';
import { onSetFocus } from '../focusElement';
import { onSystemClickElement } from '../interactWithElement';
import { SupportState } from './state';

const onStartSupport = (
  supportState: SupportState,
  levelOfSupport: LevelOfSupport,
) => {
  supportState.collectStruggleData = true;
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
        supportState,
        true,
        stepToHelpWith,
      );
      // console.log(`Element was focussed: ${focussedOnElement}`);
      if (focussedOnElement && stepToHelpWith.type === ASTNodeType.ScrollTo) {
        // TODO: make timeout proportional to reading time
        // supportState.timeoutId = setTimeout(() => {
        //   sendDetectionMessage(supportState, stepToHelpWith);
        //   onUnsetFocus();
        // }, 6000);
      }
    } else if (supportState.levelOfSupport === 'click') {
      // console.log('Trying to complete action for user');
      const focussedOnElement = onSetFocus(
        stepToHelpWith.element.tag,
        stepToHelpWith.element.outerHTML,
        supportState,
        false,
        stepToHelpWith,
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

export { onStartSupport, onEndSupport, onReceiveNextPossibleSteps };
