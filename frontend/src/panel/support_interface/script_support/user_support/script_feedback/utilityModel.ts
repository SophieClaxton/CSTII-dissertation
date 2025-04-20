import {
  ScriptFeedbackAction,
  ScriptFeedbackGoal,
} from '../../../../models/UserSupport';
import { UtilityModel } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';

const getScriptFeedbackUtilityModel =
  (): UtilityModel<ScriptFeedbackAction, ScriptFeedbackGoal> =>
  (_action, _goal) =>
    1;

export { getScriptFeedbackUtilityModel };
