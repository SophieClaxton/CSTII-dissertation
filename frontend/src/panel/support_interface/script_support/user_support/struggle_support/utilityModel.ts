import {
  StruggleUtilityEqn,
  SystemSupportAction,
  systemSupportActions,
  UserSupportGoal,
} from '../../../../models/support_and_MII/StruggleSupportMII';
import {
  LevelOfSupport,
  levelsOfSupport,
} from '../../../../models/support_and_MII/UserSupport';
import { UtilityModel } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';

const defaultStruggleUtilityEquations: Record<
  UserSupportGoal,
  StruggleUtilityEqn
> = {
  inc: (a, l) =>
    (4.7 - 1.5 * l) * Math.tanh((1.1 + l / 4) * (a - 1.9 + l / 4)) +
    (4.6 - 1.4 * l),
  dec: (a, l) =>
    (1.5 * (2 - l) - 4.5) * Math.tanh((1.25 - l / 4) * (a - 2.3 - l / 6)) +
    (3.7 - 0.9 * (2 - l)),
  none: (a, l) =>
    10 * Math.exp(-2 * Math.pow((a - 2 + (l - 1) / 2.25) / 1.2, 4)),
};

const getSupportChangeUtilityModel =
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

export { getSupportChangeUtilityModel };
