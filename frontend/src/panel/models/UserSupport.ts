import { UserStruggleData } from '../../common/message';

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

export { systemSupportActions, userSupportActions, levelsOfSupport };
export type {
  SupportChange,
  SystemSupportAction,
  UserSupportAction,
  UserStruggleEvidence,
  LevelOfSupport,
};
