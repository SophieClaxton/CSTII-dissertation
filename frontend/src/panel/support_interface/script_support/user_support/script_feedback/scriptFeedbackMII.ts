import {
  LevelOfSupport,
  ScriptFeedbackAction,
  scriptFeedbackActions,
  ScriptFeedbackGoal,
  scriptFeedbackGoals,
  UserStruggleData,
  UserStruggleEvidence,
} from '../../../../models/UserSupport';
import { getMII } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';
import { getScriptFeedbackGoalLikelihoodModel } from './goalLikelihoodModel';
import { getScriptFeedbackUtilityModel } from './utilityModel';

const getNextScriptFeedbackAction = (
  userStruggleData: UserStruggleData,
  deltaStepsCompleted: number,
  currentLevelOfSupport: LevelOfSupport,
): ScriptFeedbackAction => {
  const evidence = { ...userStruggleData, deltaStepsCompleted };
  // console.log(evidence);
  const bestAction = getMII<
    ScriptFeedbackAction,
    ScriptFeedbackGoal,
    UserStruggleEvidence
  >({
    goalLikelihoodModel: getScriptFeedbackGoalLikelihoodModel(
      currentLevelOfSupport,
    ),
    utilityModel: getScriptFeedbackUtilityModel(),
    actions: scriptFeedbackActions,
    goals: scriptFeedbackGoals,
  }).getBestAction(evidence);
  // console.log(
  //   `Best action for k=${deltaStepsCompleted}, l=${currentLevelOfSupport} is: ${bestAction}`,
  // );
  return bestAction;
};

export { getNextScriptFeedbackAction };
