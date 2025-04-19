const levelsOfSupport = ['text', 'overlay', 'click'] as const;
type LevelOfSupport = (typeof levelsOfSupport)[number];

const supportChanges = ['inc', 'dec'] as const;
const userSupportGoals = [...supportChanges, 'none'] as const;
const systemSupportActions = [
  'dec',
  'dec_dialog',
  'none',
  'inc_dialog',
  'inc',
] as const;

type SupportChange = (typeof supportChanges)[number];
type UserSupportGoal = (typeof userSupportGoals)[number];
type SystemSupportAction = (typeof systemSupportActions)[number];

interface UserStruggleData {
  totalDistance: number;
  numMouseClicks: number;
  totalScrollDistance: number;
}

type UserStruggleEvidence = UserStruggleData & {
  deltaStepsCompleted: number;
};

type StruggleModel = (data: UserStruggleData) => number;
type StruggleProbEqn = (struggleProb: number, k: number) => number;

type StruggleUtilityEqn = (
  actionIndex: number,
  levelOfSupportIndex: number,
) => number;

export { systemSupportActions, userSupportGoals, levelsOfSupport };
export type {
  LevelOfSupport,
  SupportChange,
  SystemSupportAction,
  UserSupportGoal,
  UserStruggleData,
  UserStruggleEvidence,
  StruggleModel,
  StruggleProbEqn,
  StruggleUtilityEqn,
};
