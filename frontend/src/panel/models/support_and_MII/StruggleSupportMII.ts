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

type UserSupportProbEqn = (struggleProb: number, k: number) => number;

type StruggleUtilityEqn = (
  actionIndex: number,
  levelOfSupportIndex: number,
) => number;

export { supportChanges, userSupportGoals, systemSupportActions };
export type {
  SupportChange,
  UserSupportGoal,
  SystemSupportAction,
  UserSupportProbEqn,
  StruggleUtilityEqn,
};
