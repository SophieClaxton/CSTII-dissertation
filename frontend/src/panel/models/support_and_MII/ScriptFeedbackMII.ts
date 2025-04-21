const scriptFeedbackGoals = ['none', 'send'] as const;
type ScriptFeedbackGoal = (typeof scriptFeedbackGoals)[number];

const scriptFeedbackActions = ['none', 'dialog', 'send'] as const;
type ScriptFeedbackAction = (typeof scriptFeedbackActions)[number];

type ScriptProblemProbEqn = (
  struggleProb: number,
  l: number,
  k: number,
) => number;
type ScriptFeedbackUtilityEqn = (actionIndex: number) => number;

export { scriptFeedbackGoals, scriptFeedbackActions };
export type {
  ScriptFeedbackGoal,
  ScriptFeedbackAction,
  ScriptProblemProbEqn,
  ScriptFeedbackUtilityEqn,
};
