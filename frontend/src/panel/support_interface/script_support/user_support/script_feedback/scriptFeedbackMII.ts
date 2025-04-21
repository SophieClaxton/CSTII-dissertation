import {
  ScriptFeedbackAction,
  ScriptFeedbackGoal,
  scriptFeedbackActions,
  scriptFeedbackGoals,
} from '../../../../models/support_and_MII/ScriptFeedbackMII';
import {
  LevelOfSupport,
  UserStruggleData,
  UserStruggleEvidence,
} from '../../../../models/support_and_MII/UserSupport';
import { StateSetter } from '../../../../models/utilTypes';
import { getMII } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';
import { FeedbackActionDialogProps } from './FeedbackActionDialog';
import { getScriptFeedbackGoalLikelihoodModel } from './goalLikelihoodModel';
import { getScriptFeedbackUtilityModel } from './utilityModel';

const getNextScriptFeedbackAction = (
  userStruggleData: UserStruggleData,
  stepsCompleted: number,
  currentLevelOfSupport: LevelOfSupport,
): ScriptFeedbackAction => {
  const evidence = { ...userStruggleData, stepsCompleted };
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

const performBestScriptFeedbackAction = (
  userStruggleData: UserStruggleData,
  levelOfSupport: LevelOfSupport,
  stepsCompleted: number,
  setFeedbackActionDialogDetails: StateSetter<FeedbackActionDialogProps>,
) => {
  const nextAction = getNextScriptFeedbackAction(
    userStruggleData,
    stepsCompleted,
    levelOfSupport,
  );

  switch (nextAction) {
    case 'none':
      return;
    case 'dialog':
      return setFeedbackActionDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: nextAction,
        onAction: () => {
          console.log('Sending annotation message');
        },
      }));
    case 'send': {
      console.log('Sending annotation message');
      return setFeedbackActionDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: nextAction,
      }));
    }
  }
};

export { performBestScriptFeedbackAction };
