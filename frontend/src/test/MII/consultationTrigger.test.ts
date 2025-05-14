import {
  ConsultationTriggerAction,
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

interface ConsultationTriggerTest {
  p: number;
  LOS: LevelOfSupport;
  stepsCompleted: number;
  timeSinceInteraction: number;
  outcome: ConsultationTriggerAction;
}

const consultationTriggerTests: ConsultationTriggerTest[] = [
  {
    p: 0.5,
    LOS: 'hints',
    stepsCompleted: 1,
    timeSinceInteraction: 20,
    outcome: 'none',
  },
  {
    p: 0.8,
    LOS: 'hints',
    stepsCompleted: 0,
    timeSinceInteraction: 10,
    outcome: 'none',
  },
  {
    p: 1,
    LOS: 'text',
    stepsCompleted: 20,
    timeSinceInteraction: 0,
    outcome: 'none',
  },
  {
    p: 0.7,
    LOS: 'auto',
    stepsCompleted: 0,
    timeSinceInteraction: 10,
    outcome: 'dialog',
  },
  {
    p: 1,
    LOS: 'auto',
    stepsCompleted: 0,
    timeSinceInteraction: 10,
    outcome: 'send',
  },
  {
    p: 0.6,
    LOS: 'auto',
    stepsCompleted: 0,
    timeSinceInteraction: 20,
    outcome: 'dialog',
  },
];

describe('getBestActionResults', () => {
  it.each(consultationTriggerTests)(
    'correctly returns $outcome for P(struggle)=$p, k=$stepsCompleted, LOS=$LOS, time=$timeSinceInteraction',
    ({ p, LOS, stepsCompleted, timeSinceInteraction, outcome }) => {
      const MII = getMII<
        ConsultationTriggerAction,
        ConsultationTriggerGoal,
        UserStruggleEvidence
      >({
        actions: consultationTriggerActions,
        goals: consultationTriggerGoals,
        goalLikelihoodModel: getConsultationTriggerUserModel(() => p),
        utilityModel: getConsultationTriggerUtilityModel(timeSinceInteraction),
      });
      const action = MII.getBestAction({
        totalDistance: 0,
        totalScrollDistance: 0,
        numMouseClicks: 0,
        stepsCompleted,
        timeSinceInteraction,
        levelOfSupport: LOS,
      });

      expect(action).toBe(outcome);
    },
  );
});
