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
import { StateRef, StateSetter } from '../../models/utilTypes';
import { getMII } from '../mixedInitiativeInteraction';
import { FeedbackActionDialogProps } from './FeedbackActionDialog';
import { getConsultationTriggerUserModel } from './userModel';
import { getConsultationTriggerUtilityModel } from './utilityModel';

const getNextConsultationTriggerAction = (
  interactionData: InteractionData,
  stepsCompleted: number,
  levelOfSupport: LevelOfSupport,
  timeSinceInteraction: number,
): ConsultationTriggerActions => {
  const evidence = {
    ...interactionData,
    stepsCompleted,
    levelOfSupport,
    timeSinceInteraction,
  };
  // console.log(evidence);
  const bestAction = getMII<
    ConsultationTriggerActions,
    ConsultationTriggerGoal,
    UserStruggleEvidence
  >({
    goalLikelihoodModel: getConsultationTriggerUserModel(),
    utilityModel: getConsultationTriggerUtilityModel(timeSinceInteraction),
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
  timeSinceInteraction: number,
  lastInteractionAt: StateRef<number>,
  setFeedbackActionDialogDetails: StateSetter<FeedbackActionDialogProps>,
  onAnnotate: () => void,
) => {
  const nextAction = getNextConsultationTriggerAction(
    interactionData,
    stepsCompleted,
    levelOfSupport,
    timeSinceInteraction,
  );

  switch (nextAction) {
    case 'none':
      return;
    case 'dialog':
      lastInteractionAt.current = Date.now();
      return setFeedbackActionDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: nextAction,
        onAction: onAnnotate,
      }));
    case 'send': {
      lastInteractionAt.current = Date.now();
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
