import {
  LevelOfSupport,
  levelsOfSupport,
  ScriptFeedbackGoal,
  UserStruggleEvidence,
} from '../../../../models/UserSupport';
import { GoalLikelihoodModel } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';

const getScriptFeedbackGoalLikelihoodModel = (
  levelOfSupport: LevelOfSupport,
): GoalLikelihoodModel<ScriptFeedbackGoal, UserStruggleEvidence> => {
  return (_goal, _evidence) =>
    0.5 + (levelsOfSupport.indexOf(levelOfSupport) - 1) / 5;
};

export { getScriptFeedbackGoalLikelihoodModel };
