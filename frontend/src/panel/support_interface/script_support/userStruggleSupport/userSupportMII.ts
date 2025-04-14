import { UserStruggleData } from '../../../../messaging/message';
import { getActionMaximisingExpectedUtility } from '../mixedInitiativeInteraction';
import {
  userStruggleUserModel,
  userStruggleUtilityModel,
} from './userStruggleModels';

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

const levelsOfSupport = ['text', 'overlay', 'click'] as const;
type LevelOfSupport = (typeof levelsOfSupport)[number];

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

export { getNextSystemSupportAction, levelsOfSupport };
export type {
  SupportChange,
  SystemSupportAction,
  UserSupportAction,
  UserStruggleEvidence,
  LevelOfSupport,
};
