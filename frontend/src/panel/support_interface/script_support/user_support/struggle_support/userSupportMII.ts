import { UserStruggleData } from '../../../../../messaging/message';
import {
  LevelOfSupport,
  UserStruggleEvidence,
} from '../../../../models/support_and_MII/UserSupport';
import { StateSetter } from '../../../../models/utilTypes';
import { SupportActionDialogProps } from '../script_feedback/SupportActionDialog';
import { getMII } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';
import {
  increaseLevelOfSupport,
  decreaseLevelOfSupport,
} from '../levelOfSupportUtils';
import { getSupportChangeLikelihoodModel } from './goalLikelihoodModel';
import { getSupportChangeUtilityModel } from './utilityModel';
import {
  SystemSupportAction,
  UserSupportGoal,
  systemSupportActions,
  userSupportGoals,
} from '../../../../models/support_and_MII/StruggleSupportMII';

const getNextStruggleSupportAction = (
  userStruggleData: UserStruggleData,
  stepsCompleted: number,
  currentLevelOfSupport: LevelOfSupport,
): SystemSupportAction => {
  const evidence = { ...userStruggleData, stepsCompleted };
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
  //   `Best action for k=${stepsCompleted}, l=${currentLevelOfSupport} is: ${bestAction}`,
  // );
  return bestAction;
};

const performBestStruggleSupportAction = (
  userStruggleData: UserStruggleData,
  levelOfSupport: LevelOfSupport,
  stepsCompleted: number,
  setLevelOfSupport: StateSetter<LevelOfSupport>,
  setSupportDialogDetails: StateSetter<SupportActionDialogProps>,
) => {
  const nextAction = getNextStruggleSupportAction(
    userStruggleData,
    stepsCompleted,
    levelOfSupport,
  );
  switch (nextAction) {
    case 'inc':
      return setLevelOfSupport(increaseLevelOfSupport);
    case 'dec':
      return setLevelOfSupport(decreaseLevelOfSupport);
    case 'none':
      return;
    case 'inc_dialog':
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: 'inc',
        onAction: () => setLevelOfSupport(increaseLevelOfSupport),
      }));
    case 'dec_dialog':
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        action: 'dec',
        onAction: () => setLevelOfSupport(decreaseLevelOfSupport),
      }));
  }
};

export { performBestStruggleSupportAction, getNextStruggleSupportAction };
