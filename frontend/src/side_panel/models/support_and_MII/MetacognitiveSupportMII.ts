import { LevelOfSupport } from './UserSupport';

const supportChanges = ['inc', 'dec'] as const;
const metacognitiveSupportGoals = [...supportChanges, 'none'] as const;
const metacognitiveSupportActions = [
  'dec',
  'dec_dialog',
  'none',
  'inc_dialog',
  'inc',
] as const;

type SupportChange = (typeof supportChanges)[number];
type MetacognitiveSupportGoal = (typeof metacognitiveSupportGoals)[number];
type MetacognitiveSupportAction = (typeof metacognitiveSupportActions)[number];

/** User Model Equations:
 *
 * @param p probability of struggle
 * @param k number of steps completed in last 5 seconds
 * @param l level of support
 */
type SupportLevelProbEqn = (p: number, k: number, l: LevelOfSupport) => number;

/** Utility Model Equations:
 *
 * @param a action index
 * @param l level of support index
 * @param t time since last interaction
 */
type MetacognitiveSupportUtilityEqn = (
  a: number,
  l: number,
  t: number,
) => number;

export {
  supportChanges,
  metacognitiveSupportGoals,
  metacognitiveSupportActions,
};
export type {
  SupportChange,
  MetacognitiveSupportGoal,
  MetacognitiveSupportAction,
  SupportLevelProbEqn,
  MetacognitiveSupportUtilityEqn,
};
