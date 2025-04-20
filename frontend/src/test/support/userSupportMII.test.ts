import { UserStruggleData } from '../../messaging/message';
import {
  SystemSupportAction,
  systemSupportActions,
  UserStruggleEvidence,
  userSupportGoals,
  UserSupportGoal,
  LevelOfSupport,
} from '../../panel/models/UserSupport';
import { getMII } from '../../panel/support_interface/script_support/mixed_initiative_interaction.ts/mixedInitiativeInteraction';
import { softmax } from '../../panel/support_interface/script_support/user_support/modelUtils';
import getSupportChangeLikelihoodModel from '../../panel/support_interface/script_support/user_support/struggle_support/goalLikelihoodModel';
import { getNextStruggleSupportAction } from '../../panel/support_interface/script_support/user_support/struggle_support/userSupportMII';
import getSupportChangeUtilityModel from '../../panel/support_interface/script_support/user_support/struggle_support/utilityModel';

describe('softmax', () => {
  it('returns numbers', () => {
    const allResults = [
      21.65198695998898, 5.973904409203186, 7.906842672458263,
    ];
    const [prob] = softmax(allResults);
    expect(prob).not.toBeNaN();
  });

  it('sums to 1', () => {
    const values = [21, 5, 7];
    const softValues = softmax(values);
    const sum = softValues.reduce((prev, curr) => prev + curr);
    expect(sum).toBeCloseTo(1, 2);
  });
});

describe('getNextSystemSupportAction', () => {
  it('succeeds', () => {
    const userStruggleData: UserStruggleData = {
      totalDistance: Math.log(1173.732143181506),
      totalScrollDistance: Math.log(280.7),
      numMouseClicks: 1.4,
    };
    const action = getNextStruggleSupportAction(userStruggleData, 1, 'click');
    expect(action).not.toBeUndefined();
  });
});

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
      outcome: 'inc_dialog',
    },
    {
      struggleProb: 0.5,
      LOS: 'click',
      stepsCompleted: 0,
      outcome: 'dec_dialog',
    },
    {
      struggleProb: 0.5,
      LOS: 'click',
      stepsCompleted: 6,
      outcome: 'dec_dialog',
    },
    {
      struggleProb: 0.5,
      LOS: 'overlay',
      stepsCompleted: 0,
      outcome: 'inc_dialog',
    },
  ])(
    'correctly returns $outcome for P(struggle)=$struggleProb, k=$stepsCompleted, LOS=$LOS',
    ({ struggleProb, LOS, stepsCompleted, outcome }) => {
      const MII = getMII<
        SystemSupportAction,
        UserSupportGoal,
        UserStruggleEvidence
      >({
        actions: systemSupportActions,
        goals: userSupportGoals,
        goalLikelihoodModel: getSupportChangeLikelihoodModel(() => struggleProb),
        utilityModel: getSupportChangeUtilityModel(LOS as LevelOfSupport),
      });
      const action = MII.getBestAction({
        totalDistance: 0,
        totalScrollDistance: 0,
        numMouseClicks: 0,
        deltaStepsCompleted: stepsCompleted,
      });

      expect(action).toBe(outcome);
    },
  );
});
