import {
  ConsultationTriggerAction,
  consultationTriggerActions,
  ConsultationTriggerGoal,
  ConsultationTriggerUtilityEqn,
} from '../../models/support_and_MII/ConsultationTriggerMII';
import { UtilityModel } from '../mixedInitiativeInteraction';

const defaultStruggleUtilityEquations: Record<
  ConsultationTriggerGoal,
  ConsultationTriggerUtilityEqn
> = {
  send: (a, t) => {
    const t2 = -Math.exp(-Math.pow(0.1 * t, 3)) + 1;
    return (4 * t2 + 1) * Math.tanh(5 * a - 5 + 2 * t2) + (4 * t2 + 1);
  },
  none: (a, t) => {
    const t2 = -Math.exp(-Math.pow(0.1 * t, 3)) + 1;
    return 9 * Math.exp(-(4 - 2 * Math.pow(t2, 0.1)) * a);
  },
};

const getConsultationTriggerUtilityModel =
  (
    timeSinceInteraction: number,
    utilityEqns: Record<
      ConsultationTriggerGoal,
      ConsultationTriggerUtilityEqn
    > = defaultStruggleUtilityEquations,
  ): UtilityModel<ConsultationTriggerAction, ConsultationTriggerGoal> =>
  (action: ConsultationTriggerAction, goal: ConsultationTriggerGoal) => {
    const utility = utilityEqns[goal](
      consultationTriggerActions.indexOf(action),
      timeSinceInteraction,
    );
    return utility;
  };

export { getConsultationTriggerUtilityModel };
