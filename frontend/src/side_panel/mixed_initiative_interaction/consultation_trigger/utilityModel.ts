import {
  ConsultationTriggerActions,
  consultationTriggerActions,
  ConsultationTriggerGoal,
  ConsultationTriggerUtilityEqn,
} from '../../models/support_and_MII/ConsultationTriggerMII';
import { UtilityModel } from '../mixedInitiativeInteraction';

const defaultStruggleUtilityEquations: Record<
  ConsultationTriggerGoal,
  ConsultationTriggerUtilityEqn
> = {
  send: (a) => 3 * Math.tanh(1.5 * a - 0.8) + 4,
  none: (a) => Math.exp(-0.67 * a + 2.5) - 2.2,
};

const getConsultationTriggerUtilityModel =
  (
    utilityEqns: Record<
      ConsultationTriggerGoal,
      ConsultationTriggerUtilityEqn
    > = defaultStruggleUtilityEquations,
  ): UtilityModel<ConsultationTriggerActions, ConsultationTriggerGoal> =>
  (action: ConsultationTriggerActions, goal: ConsultationTriggerGoal) => {
    const utility = utilityEqns[goal](
      consultationTriggerActions.indexOf(action),
    );
    return utility;
  };

export { getConsultationTriggerUtilityModel };
