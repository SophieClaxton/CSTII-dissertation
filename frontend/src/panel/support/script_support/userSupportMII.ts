import { UserStruggleData } from '../../../common/message';
import {
  getActionMaximisingExpectedUtility,
  UserModel,
  UtilityModel,
} from './mixedInitiativeInteraction';

const supportChanges = ['inc', 'dec'] as const;
const userSupportActions = [...supportChanges, 'none'] as const;
const systemSupportActions = [
  ...userSupportActions,
  'inc_dialog',
  'dec_dialog',
] as const;

type SupportChange = (typeof supportChanges)[number];
type UserSupportAction = (typeof userSupportActions)[number];
type SystemSupportAction = (typeof systemSupportActions)[number];

interface UserStruggleEvidence {
  userStruggleData: UserStruggleData;
  deltaStepsCompleted: number;
}

const userStruggleUserModel: UserModel<
  UserSupportAction,
  UserStruggleEvidence
> = (_goal: UserSupportAction, _evidence: UserStruggleEvidence) => 1;

const userStruggleUtilityModel: UtilityModel<
  SystemSupportAction,
  UserSupportAction
> = (action: SystemSupportAction, _goal: UserSupportAction) =>
  action === 'none' ? 1 : 0;

const getNextSystemSupportAction = (
  userStruggleData: UserStruggleData,
  deltaStepsCompleted: number,
) => {
  return getActionMaximisingExpectedUtility<
    SystemSupportAction,
    UserSupportAction,
    UserStruggleEvidence
  >(
    systemSupportActions,
    { userStruggleData, deltaStepsCompleted },
    userSupportActions,
    userStruggleUserModel,
    userStruggleUtilityModel,
  );
};

const levelsOfSupport = ['text', 'overlay', 'click'] as const;
type LevelOfSupport = (typeof levelsOfSupport)[number];

const LoSDescription: Record<LevelOfSupport, string> = {
  text: 'The system will only provide instructions, but will indicate which steps have been completed.',
  overlay:
    'The system will provide instructions and show you what you need to interact with by scrolling to it and putting a pink rectangle around it.',
  click: 'The system will perform the next action for you automatically.',
};

const increaseLevelOfSupport = (level: LevelOfSupport): LevelOfSupport => {
  switch (level) {
    case 'text':
      return 'overlay';
    case 'overlay':
      return 'click';
    case 'click':
      return 'click';
  }
};

const decreaseLevelOfSupport = (level: LevelOfSupport): LevelOfSupport => {
  switch (level) {
    case 'text':
      return 'text';
    case 'overlay':
      return 'text';
    case 'click':
      return 'overlay';
  }
};

export {
  getNextSystemSupportAction,
  increaseLevelOfSupport,
  decreaseLevelOfSupport,
  levelsOfSupport,
  LoSDescription,
};
export type { SupportChange, SystemSupportAction, LevelOfSupport };
