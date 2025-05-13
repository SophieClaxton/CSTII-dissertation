const consultationTriggerGoals = ['none', 'send'] as const;
type ConsultationTriggerGoal = (typeof consultationTriggerGoals)[number];

const consultationTriggerActions = ['none', 'dialog', 'send'] as const;
type ConsultationTriggerActions = (typeof consultationTriggerActions)[number];

type SupportProblemProbEqn = (
  struggleProb: number,
  l: number,
  k: number,
) => number;
type ConsultationTriggerUtilityEqn = (actionIndex: number) => number;

export { consultationTriggerGoals, consultationTriggerActions };
export type {
  ConsultationTriggerGoal,
  ConsultationTriggerActions,
  SupportProblemProbEqn,
  ConsultationTriggerUtilityEqn,
};
