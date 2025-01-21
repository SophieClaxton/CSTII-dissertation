import {
  StartSupportMessage,
  UserStruggleDataMessage,
} from '../common/message';
import { ASTStepNodeInfo } from '../panel/models/AST/AST';
import { SelectableTag } from '../panel/models/InterfaceElement';
import { LevelOfSupport } from '../panel/support/script_support/userSupportMII';
import { defaultLevelOfSupport } from './consts';

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
  levelOfSupport: LevelOfSupport;
  nextPossibleSteps: ASTStepNodeInfo[];
  lastScrollPosition: { x: number; y: number };
}

const onStartSupport = (
  supportState: SupportState,
  message: StartSupportMessage,
) => {
  supportState.collectStruggleData = true;
  supportState.levelOfSupport = message.levelOfSupport;
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
};

const onEndSupport = (supportState: SupportState) => {
  supportState.collectStruggleData = false;
  supportState.levelOfSupport = defaultLevelOfSupport;
  clearInterval(supportState.intervalId);
};

export type { EditingState, SupportState };
export { onStartSupport, onEndSupport };
