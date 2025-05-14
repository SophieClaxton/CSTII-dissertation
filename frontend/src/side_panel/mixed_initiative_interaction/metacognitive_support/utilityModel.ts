import {
  MetacognitiveSupportUtilityEqn,
  MetacognitiveSupportAction,
  metacognitiveSupportActions,
  MetacognitiveSupportGoal,
} from '../../models/support_and_MII/MetacognitiveSupportMII';
import {
  LevelOfSupport,
  levelsOfSupport,
} from '../../models/support_and_MII/UserSupport';
import { UtilityModel } from '../mixedInitiativeInteraction';

const defaultStruggleUtilityEquations: Record<
  MetacognitiveSupportGoal,
  MetacognitiveSupportUtilityEqn
> = {
  inc: (a, l, t) => {
    const t2 = -Math.exp(-0.02 * Math.pow(t, 2)) + 1;
    const scale = 2 + 3 * t2 - 0.5 * l;
    return scale * Math.tanh(2 * (a - 1.8)) + scale;
  },
  dec: (a, l, t) => {
    const t2 = -Math.exp(-0.02 * Math.pow(t, 2)) + 1;
    const l2 = 2 - l;
    const scale = 1 + 3.5 * t2 - 0.25 * l2;
    return -scale * Math.tanh(2 * (a - 2.2)) + scale;
  },
  none: (a, _l, t) => {
    const t2 = -Math.exp(-0.02 * Math.pow(t, 2)) + 1;
    return (
      10 *
      Math.exp(-(3 - 2.5 * t2) * Math.pow(a - 2, 2 * Math.round(1 + 1 * t2)))
    );
  },
};

const getSupportChangeUtilityModel =
  (
    levelOfSupport: LevelOfSupport,
    timeSinceInteraction: number,
    utilityEqns: Record<
      MetacognitiveSupportGoal,
      MetacognitiveSupportUtilityEqn
    > = defaultStruggleUtilityEquations,
  ): UtilityModel<MetacognitiveSupportAction, MetacognitiveSupportGoal> =>
  (action: MetacognitiveSupportAction, goal: MetacognitiveSupportGoal) => {
    if (
      (levelOfSupport === 'text' && action === 'dec_dialog') ||
      (levelOfSupport === 'click' && action === 'inc_dialog')
    ) {
      return 0;
    }
    const utility = utilityEqns[goal](
      metacognitiveSupportActions.indexOf(action),
      levelsOfSupport.indexOf(levelOfSupport),
      timeSinceInteraction,
    );
    return utility;
  };

export { getSupportChangeUtilityModel };
