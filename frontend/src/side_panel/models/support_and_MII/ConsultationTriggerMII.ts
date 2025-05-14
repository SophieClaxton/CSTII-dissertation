import { LevelOfSupport } from './UserSupport';

const consultationTriggerGoals = ['none', 'send'] as const;
type ConsultationTriggerGoal = (typeof consultationTriggerGoals)[number];

const consultationTriggerActions = ['none', 'dialog', 'send'] as const;
type ConsultationTriggerAction = (typeof consultationTriggerActions)[number];

/** User Model Equations:
 *
 * @param p probability of struggle
 * @param k number of steps completed in last 5 seconds
 * @param l level of support
 */
type SupportProblemProbEqn = (
  p: number,
  k: number,
  l: LevelOfSupport,
) => number;

/** Utility Model Equations:
 *
 * @param a action index
 * @param t time since last interaction
 */
type ConsultationTriggerUtilityEqn = (a: number, t: number) => number;

export { consultationTriggerGoals, consultationTriggerActions };
export type {
  ConsultationTriggerGoal,
  ConsultationTriggerAction,
  SupportProblemProbEqn,
  ConsultationTriggerUtilityEqn,
};
