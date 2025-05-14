import {
  InteractionData,
  LevelOfSupport,
  UserStruggleEvidence,
} from '../../models/support_and_MII/UserSupport';
import { StateRef, StateSetter } from '../../models/utilTypes';
import { SupportActionDialogProps } from './SupportActionDialog';
import { getMII } from '../mixedInitiativeInteraction';
import { getSupportChangeUserModel } from './userModel';
import { getSupportChangeUtilityModel } from './utilityModel';
import {
  MetacognitiveSupportAction,
  MetacognitiveSupportGoal,
  metacognitiveSupportActions,
  metacognitiveSupportGoals,
} from '../../models/support_and_MII/MetacognitiveSupportMII';
import {
  increaseLevelOfSupport,
  decreaseLevelOfSupport,
} from './levelOfSupportUtils';

const getNextStruggleSupportAction = (
  interactionData: InteractionData,
  stepsCompleted: number,
  levelOfSupport: LevelOfSupport,
  timeSinceInteraction: number,
): MetacognitiveSupportAction => {
  const evidence = {
    ...interactionData,
    stepsCompleted,
    levelOfSupport,
    timeSinceInteraction,
  };
  // console.log(evidence);
  const bestAction = getMII<
    MetacognitiveSupportAction,
    MetacognitiveSupportGoal,
    UserStruggleEvidence
  >({
    goalLikelihoodModel: getSupportChangeUserModel(),
    utilityModel: getSupportChangeUtilityModel(
      levelOfSupport,
      timeSinceInteraction,
    ),
    actions: metacognitiveSupportActions,
    goals: metacognitiveSupportGoals,
  }).getBestAction(evidence);
  // console.log(
  //   `Best action for k=${stepsCompleted}, l=${levelOfSupport} is: ${bestAction}`,
  // );
  return bestAction;
};

const performBestStruggleSupportAction = (
  userStruggleData: InteractionData,
  levelOfSupport: LevelOfSupport,
  stepsCompleted: number,
  timeSinceInteraction: number,
  lastInteractionAt: StateRef<number>,
  setLevelOfSupport: StateSetter<LevelOfSupport>,
  setSupportDialogDetails: StateSetter<SupportActionDialogProps>,
) => {
  const nextAction = getNextStruggleSupportAction(
    userStruggleData,
    stepsCompleted,
    levelOfSupport,
    timeSinceInteraction,
  );
  switch (nextAction) {
    case 'inc': {
      setLevelOfSupport(increaseLevelOfSupport);
      lastInteractionAt.current = Date.now();
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: 'inc',
      }));
    }
    case 'dec': {
      setLevelOfSupport(decreaseLevelOfSupport);
      lastInteractionAt.current = Date.now();
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: nextAction,
      }));
    }
    case 'none':
      return;
    case 'inc_dialog':
      lastInteractionAt.current = Date.now();
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: nextAction,
        onAction: () => setLevelOfSupport(increaseLevelOfSupport),
      }));
    case 'dec_dialog':
      lastInteractionAt.current = Date.now();
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: nextAction,
        onAction: () => setLevelOfSupport(decreaseLevelOfSupport),
      }));
  }
};

export { performBestStruggleSupportAction, getNextStruggleSupportAction };
