import {
  LevelOfSupport,
  levelsOfSupport,
  StruggleUtilityEqn,
  SystemSupportAction,
  systemSupportActions,
  UserSupportGoal,
} from '../../../../models/UserSupport';
import { UtilityModel } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';

const defaultStruggleUtilityEquations: Record<
  UserSupportGoal,
  StruggleUtilityEqn
> = {
  inc: (a, l) =>
    (4 - l) * Math.tanh((3 - l) * (a - 2.8 + l / 4)) + (5.5 - 1.5 * l),
  dec: (a, l) =>
    (2 - l - 4) * Math.tanh((3 - (2 - l)) * (a - 2.1 + l / 2)) +
    (5.5 - 1.25 * (2 - l)),
  none: (a, l) =>
    8 * Math.exp(-2 * Math.pow((a - 2 + (l - 1) / 2) / 1.25, 2)) + 2,
};

const getUserUtilityModel =
  (
    currentLevelOfSupport: LevelOfSupport,
    utilityEqns: Record<
      UserSupportGoal,
      StruggleUtilityEqn
    > = defaultStruggleUtilityEquations,
  ): UtilityModel<SystemSupportAction, UserSupportGoal> =>
  (action: SystemSupportAction, goal: UserSupportGoal) => {
    if (
      (currentLevelOfSupport === 'text' && action === 'dec_dialog') ||
      (currentLevelOfSupport === 'click' && action === 'inc_dialog')
    ) {
      return 0;
    }
    const utility = utilityEqns[goal](
      systemSupportActions.indexOf(action),
      levelsOfSupport.indexOf(currentLevelOfSupport),
    );
    return utility;
  };

export default getUserUtilityModel;
