import {
  MetacognitiveSupportAction,
  MetacognitiveSupportGoal,
  metacognitiveSupportActions,
  metacognitiveSupportGoals,
} from '../../side_panel/models/support_and_MII/MetacognitiveSupportMII';
import {
  LevelOfSupport,
  UserStruggleEvidence,
} from '../../side_panel/models/support_and_MII/UserSupport';
import { getMII } from '../../side_panel/mixed_initiative_interaction/mixedInitiativeInteraction';
import { getSupportChangeUserModel } from '../../side_panel/mixed_initiative_interaction/metacognitive_support/userModel';
import { getSupportChangeUtilityModel } from '../../side_panel/mixed_initiative_interaction/metacognitive_support/utilityModel';

interface MetacognitiveSupportTest {
  p: number;
  LOS: LevelOfSupport;
  stepsCompleted: number;
  timeSinceInteraction: number;
  outcome: MetacognitiveSupportAction;
}

const metacognitiveSupportTests: MetacognitiveSupportTest[] = [
  {
    p: 0.5,
    LOS: 'text',
    stepsCompleted: 0,
    timeSinceInteraction: 0,
    outcome: 'inc_dialog',
  },
  {
    p: 1,
    LOS: 'text',
    stepsCompleted: 1,
    timeSinceInteraction: 0,
    outcome: 'inc',
  },
  {
    p: 1,
    LOS: 'text',
    stepsCompleted: 3,
    timeSinceInteraction: 20,
    outcome: 'inc_dialog',
  },
  {
    p: 0.4,
    LOS: 'hints',
    stepsCompleted: 6,
    timeSinceInteraction: 0,
    outcome: 'dec',
  },
  {
    p: 0.6,
    LOS: 'hints',
    stepsCompleted: 0,
    timeSinceInteraction: 5,
    outcome: 'inc_dialog',
  },
  {
    p: 0.3,
    LOS: 'hints',
    stepsCompleted: 4,
    timeSinceInteraction: 20,
    outcome: 'dec_dialog',
  },
  {
    p: 0.5,
    LOS: 'auto',
    stepsCompleted: 5,
    timeSinceInteraction: 0,
    outcome: 'dec',
  },
  {
    p: 0.8,
    LOS: 'auto',
    stepsCompleted: 3,
    timeSinceInteraction: 20,
    outcome: 'dec_dialog',
  },
];

describe('getBestActionResults', () => {
  it.each(metacognitiveSupportTests)(
    'correctly returns $outcome for P(struggle)=$p, k=$stepsCompleted, LOS=$LOS, time=$timeSinceInteraction',
    ({ p, LOS, stepsCompleted, timeSinceInteraction, outcome }) => {
      const MII = getMII<
        MetacognitiveSupportAction,
        MetacognitiveSupportGoal,
        UserStruggleEvidence
      >({
        actions: metacognitiveSupportActions,
        goals: metacognitiveSupportGoals,
        goalLikelihoodModel: getSupportChangeUserModel(() => p),
        utilityModel: getSupportChangeUtilityModel(LOS, timeSinceInteraction),
      });
      const action = MII.getBestAction({
        totalDistance: 0,
        totalScrollDistance: 0,
        numMouseClicks: 0,
        stepsCompleted,
        levelOfSupport: LOS,
        timeSinceInteraction,
      });

      expect(action).toBe(outcome);
    },
  );
});
