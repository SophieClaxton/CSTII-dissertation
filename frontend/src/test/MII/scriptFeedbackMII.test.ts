import {
  ConsultationTriggerActions,
  consultationTriggerActions,
  ConsultationTriggerGoal,
  consultationTriggerGoals,
} from '../../side_panel/models/support_and_MII/ConsultationTriggerMII';
import {
  LevelOfSupport,
  UserStruggleEvidence,
} from '../../side_panel/models/support_and_MII/UserSupport';
import { getMII } from '../../side_panel/mixed_initiative_interaction/mixedInitiativeInteraction';
import { getConsultationTriggerUserModel } from '../../side_panel/mixed_initiative_interaction/consultation_trigger/userModel';
import { getConsultationTriggerUtilityModel } from '../../side_panel/mixed_initiative_interaction/consultation_trigger/utilityModel';

describe('getBestActionResults', () => {
  it.each([
    {
      struggleProb: 0.5,
      LOS: 'overlay',
      stepsCompleted: 1,
      outcome: 'none',
    },
    {
      struggleProb: 0.5,
      LOS: 'text',
      stepsCompleted: 0,
      outcome: 'none',
    },
    {
      struggleProb: 0.75,
      LOS: 'click',
      stepsCompleted: 0,
      outcome: 'send',
    },
    {
      struggleProb: 0.75,
      LOS: 'overlay',
      stepsCompleted: 0,
      outcome: 'dialog',
    },
    {
      struggleProb: 1,
      LOS: 'click',
      stepsCompleted: 3,
      outcome: 'dialog',
    },
    {
      struggleProb: 1,
      LOS: 'overlay',
      stepsCompleted: 0,
      outcome: 'send',
    },
  ])(
    'correctly returns $outcome for P(struggle)=$struggleProb, k=$stepsCompleted, LOS=$LOS',
    ({ struggleProb, LOS, stepsCompleted, outcome }) => {
      const MII = getMII<
        ConsultationTriggerActions,
        ConsultationTriggerGoal,
        UserStruggleEvidence
      >({
        actions: consultationTriggerActions,
        goals: consultationTriggerGoals,
        goalLikelihoodModel: getConsultationTriggerUserModel(
          LOS as LevelOfSupport,
          () => struggleProb,
        ),
        utilityModel: getConsultationTriggerUtilityModel(),
      });
      const action = MII.getBestAction({
        totalDistance: 0,
        totalScrollDistance: 0,
        numMouseClicks: 0,
        stepsCompleted: stepsCompleted,
      });

      expect(action).toBe(outcome);
    },
  );
});
