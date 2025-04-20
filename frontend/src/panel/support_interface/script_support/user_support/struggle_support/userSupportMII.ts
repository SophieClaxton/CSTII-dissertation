import { UserStruggleData } from '../../../../../messaging/message';
import {
  UserSupportGoal,
  UserStruggleEvidence,
  SystemSupportAction,
  systemSupportActions,
  userSupportGoals,
  LevelOfSupport,
} from '../../../../models/UserSupport';
import { getMII } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';
import { getSupportChangeLikelihoodModel } from './goalLikelihoodModel';
import { getSupportChangeUtilityModel } from './utilityModel';

const getNextStruggleSupportAction = (
  userStruggleData: UserStruggleData,
  deltaStepsCompleted: number,
  currentLevelOfSupport: LevelOfSupport,
): SystemSupportAction => {
  const evidence = { ...userStruggleData, deltaStepsCompleted };
  // console.log(evidence);
  const bestAction = getMII<
    SystemSupportAction,
    UserSupportGoal,
    UserStruggleEvidence
  >({
    goalLikelihoodModel: getSupportChangeLikelihoodModel(),
    utilityModel: getSupportChangeUtilityModel(currentLevelOfSupport),
    actions: systemSupportActions,
    goals: userSupportGoals,
  }).getBestAction(evidence);
  // console.log(
  //   `Best action for k=${deltaStepsCompleted}, l=${currentLevelOfSupport} is: ${bestAction}`,
  // );
  return bestAction;
};

export { getNextStruggleSupportAction };
