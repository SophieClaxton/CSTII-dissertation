import { UserStruggleData } from '../../../common/message';
import {
  getActionMaximisingExpectedUtility,
  UserModel,
  UtilityModel,
} from './mixedInitiativeInteraction';

const supportChanges = ['inc', 'dec'] as const;
const userSupportActions = [...supportChanges] as const;
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
> = (_action: SystemSupportAction, _goal: UserSupportAction) => 1;

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

type LevelOfSupport = 'text' | 'overlay' | 'click';

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
};
export type { SupportChange, SystemSupportAction, LevelOfSupport };
