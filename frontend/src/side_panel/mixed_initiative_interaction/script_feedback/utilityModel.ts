import {
  ScriptFeedbackAction,
  scriptFeedbackActions,
  ScriptFeedbackGoal,
  ScriptFeedbackUtilityEqn,
} from '../../models/support_and_MII/ScriptFeedbackMII';
import { UtilityModel } from '../mixedInitiativeInteraction';

const defaultStruggleUtilityEquations: Record<
  ScriptFeedbackGoal,
  ScriptFeedbackUtilityEqn
> = {
  send: (a) => 3 * Math.tanh(1.5 * a - 0.8) + 4,
  none: (a) => Math.exp(-0.67 * a + 2.5) - 2.2,
};

const getScriptFeedbackUtilityModel =
  (
    utilityEqns: Record<
      ScriptFeedbackGoal,
      ScriptFeedbackUtilityEqn
    > = defaultStruggleUtilityEquations,
  ): UtilityModel<ScriptFeedbackAction, ScriptFeedbackGoal> =>
  (action: ScriptFeedbackAction, goal: ScriptFeedbackGoal) => {
    const utility = utilityEqns[goal](scriptFeedbackActions.indexOf(action));
    return utility;
  };

export { getScriptFeedbackUtilityModel };
