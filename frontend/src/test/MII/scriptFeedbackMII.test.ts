import {
  ScriptFeedbackAction,
  scriptFeedbackActions,
  ScriptFeedbackGoal,
  scriptFeedbackGoals,
} from '../../side_panel/models/support_and_MII/ScriptFeedbackMII';
import {
  LevelOfSupport,
  UserStruggleEvidence,
} from '../../side_panel/models/support_and_MII/UserSupport';
import { getMII } from '../../side_panel/mixed_initiative_interaction/mixedInitiativeInteraction';
import { getScriptFeedbackUserModel } from '../../side_panel/mixed_initiative_interaction/script_feedback/userModel';
import { getScriptFeedbackUtilityModel } from '../../side_panel/mixed_initiative_interaction/script_feedback/utilityModel';

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
        ScriptFeedbackAction,
        ScriptFeedbackGoal,
        UserStruggleEvidence
      >({
        actions: scriptFeedbackActions,
        goals: scriptFeedbackGoals,
        goalLikelihoodModel: getScriptFeedbackUserModel(
          LOS as LevelOfSupport,
          () => struggleProb,
        ),
        utilityModel: getScriptFeedbackUtilityModel(),
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
