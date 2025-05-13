import {
  ConsultationTriggerActions,
  ConsultationTriggerGoal,
  consultationTriggerActions,
  consultationTriggerGoals,
} from '../../models/support_and_MII/ConsultationTriggerMII';
import {
  LevelOfSupport,
  InteractionData,
  UserStruggleEvidence,
} from '../../models/support_and_MII/UserSupport';
import { StateSetter } from '../../models/utilTypes';
import { getMII } from '../mixedInitiativeInteraction';
import { FeedbackActionDialogProps } from './FeedbackActionDialog';
import { getConsultationTriggerUserModel } from './userModel';
import { getConsultationTriggerUtilityModel } from './utilityModel';

const getNextConsultationTriggerAction = (
  interactionData: InteractionData,
  stepsCompleted: number,
  currentLevelOfSupport: LevelOfSupport,
): ConsultationTriggerActions => {
  const evidence = { ...interactionData, stepsCompleted };
  // console.log(evidence);
  const bestAction = getMII<
    ConsultationTriggerActions,
    ConsultationTriggerGoal,
    UserStruggleEvidence
  >({
    goalLikelihoodModel: getConsultationTriggerUserModel(currentLevelOfSupport),
    utilityModel: getConsultationTriggerUtilityModel(),
    actions: consultationTriggerActions,
    goals: consultationTriggerGoals,
  }).getBestAction(evidence);
  // console.log(
  //   `Best action for k=${deltaStepsCompleted}, l=${currentLevelOfSupport} is: ${bestAction}`,
  // );
  return bestAction;
};

const performBestConsultationTriggerAction = (
  interactionData: InteractionData,
  levelOfSupport: LevelOfSupport,
  stepsCompleted: number,
  setFeedbackActionDialogDetails: StateSetter<FeedbackActionDialogProps>,
  onAnnotate: () => void,
) => {
  const nextAction = getNextConsultationTriggerAction(
    interactionData,
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
        onAction: onAnnotate,
      }));
    case 'send': {
      onAnnotate();
      return setFeedbackActionDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: nextAction,
      }));
    }
  }
};

export { performBestConsultationTriggerAction };
