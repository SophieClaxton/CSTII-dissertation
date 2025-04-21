import {
  UserStruggleEvidence,
  StruggleProbModel,
  UserStruggleData,
  LevelOfSupport,
  levelsOfSupport,
} from '../../models/support_and_MII/UserSupport';
import * as lodash from 'lodash';
import { softmax } from '../modelUtils';
import { GoalLikelihoodModel } from '../mixedInitiativeInteraction';
import {
  ScriptFeedbackGoal,
  ScriptProblemProbEqn,
} from '../../models/support_and_MII/ScriptFeedbackMII';

const tempStruggleModel: StruggleProbModel = (_data: UserStruggleData) => 0.5;

const defautlFeedbackGoalProbEquations: Record<
  ScriptFeedbackGoal,
  ScriptProblemProbEqn
> = {
  send: (struggleProb, l, k) =>
    ((0.5 * (2.5 * l + 1)) / (k + 1)) * (Math.exp(struggleProb - 0.4) - 1),
  none: (struggleProb, l, k) =>
    ((0.25 * (k + 1)) / (2.5 * l + 1)) * (Math.exp(-struggleProb + 1) - 1),
};

const getScriptFeedbackGoalLikelihoodModel = (
  levelOfSupport: LevelOfSupport,
  struggleModel: StruggleProbModel = tempStruggleModel,
  alpha: number = 0.7,
  struggleEqns: Record<
    ScriptFeedbackGoal,
    ScriptProblemProbEqn
  > = defautlFeedbackGoalProbEquations,
): GoalLikelihoodModel<ScriptFeedbackGoal, UserStruggleEvidence> => {
  let movingEvidenceAverage: UserStruggleEvidence | undefined = undefined;
  let lastEvidence: UserStruggleEvidence | undefined = undefined;
  let probabilities: Record<ScriptFeedbackGoal, number> = {
    send: 0,
    none: 0,
  };

  return (goal: ScriptFeedbackGoal, evidence: UserStruggleEvidence) => {
    if (lodash.isEqual(evidence, lastEvidence)) {
      lastEvidence = evidence;
      return probabilities[goal];
    }

    movingEvidenceAverage = computeMovingAverage(
      movingEvidenceAverage,
      evidence,
      alpha,
    );

    probabilities = computeUserGoalProbabilities(
      struggleModel,
      movingEvidenceAverage,
      levelOfSupport,
      struggleEqns,
    );
    return probabilities[goal];
  };
};

const computeMovingAverage = (
  lastAverage: UserStruggleEvidence | undefined,
  newEvidence: UserStruggleEvidence,
  alpha: number,
): UserStruggleEvidence => {
  if (!lastAverage) {
    return newEvidence;
  }
  return {
    totalDistance:
      alpha * newEvidence.totalDistance +
      (1 - alpha) * lastAverage.totalDistance,
    totalScrollDistance:
      alpha * newEvidence.totalScrollDistance +
      (1 - alpha) * lastAverage.totalScrollDistance,
    numMouseClicks:
      alpha * newEvidence.numMouseClicks +
      (1 - alpha) * lastAverage.numMouseClicks,
    stepsCompleted:
      alpha * newEvidence.stepsCompleted +
      (1 - alpha) * lastAverage.stepsCompleted,
  };
};

const computeUserGoalProbabilities = (
  struggleModel: StruggleProbModel,
  movingEvidenceAverage: UserStruggleEvidence,
  levelOfSupport: LevelOfSupport,
  struggleEqns: Record<ScriptFeedbackGoal, ScriptProblemProbEqn>,
): Record<ScriptFeedbackGoal, number> => {
  const struggleProb = struggleModel(movingEvidenceAverage);
  // console.log(`Struggle prob: ${struggleProb}`);
  const k = movingEvidenceAverage.stepsCompleted;
  const l = levelsOfSupport.indexOf(levelOfSupport);

  const sendVal = struggleEqns.send(struggleProb, l, k);
  const noneVal = struggleEqns.none(struggleProb, l, k);

  const [send, none] = softmax([sendVal, noneVal]);
  // console.log(`Send: ${send}, None: ${none}`);
  return {
    send,
    none,
  };
};

export { getScriptFeedbackGoalLikelihoodModel };
