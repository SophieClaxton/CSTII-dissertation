import {
  UserStruggleEvidence,
  StruggleProbModel,
  UserStruggleData,
} from '../../../../models/support_and_MII/UserSupport';
import * as lodash from 'lodash';
import { softmax } from '../modelUtils';
import { GoalLikelihoodModel } from '../../mixed_initiative_interaction.ts/mixedInitiativeInteraction';
import {
  UserSupportGoal,
  UserSupportProbEqn,
} from '../../../../models/support_and_MII/StruggleSupportMII';

const tempStruggleModel: StruggleProbModel = (_data: UserStruggleData) => 0.5;

const defautlStruggleProbEquations: Record<
  UserSupportGoal,
  UserSupportProbEqn
> = {
  inc: (struggleProb, k) =>
    Math.exp(3.5 * (k / 10 + 1) * (struggleProb - 0.25 - k / 10)),
  dec: (struggleProb, k) => Math.exp(-3.5 * (struggleProb - 0.4 - k / 25)),
  none: (struggleProb, k) =>
    3 *
    Math.exp(
      -0.4 * Math.exp(-k / 5) * Math.pow(struggleProb - (5 + k) / 20, 2),
    ),
};

const getSupportChangeLikelihoodModel = (
  struggleModel: StruggleProbModel = tempStruggleModel,
  alpha: number = 0.7,
  struggleEqns: Record<
    UserSupportGoal,
    UserSupportProbEqn
  > = defautlStruggleProbEquations,
): GoalLikelihoodModel<UserSupportGoal, UserStruggleEvidence> => {
  let movingEvidenceAverage: UserStruggleEvidence | undefined = undefined;
  let lastEvidence: UserStruggleEvidence | undefined = undefined;
  let probabilities: Record<UserSupportGoal, number> = {
    inc: 0,
    dec: 0,
    none: 0,
  };

  return (goal: UserSupportGoal, evidence: UserStruggleEvidence) => {
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
  struggleEqns: Record<UserSupportGoal, UserSupportProbEqn>,
): Record<UserSupportGoal, number> => {
  const struggleProb = struggleModel(movingEvidenceAverage);
  // console.log(`Struggle prob: ${struggleProb}`);
  const k = movingEvidenceAverage.stepsCompleted;

  const incVal = struggleEqns.inc(struggleProb, k);
  const decVal = struggleEqns.dec(struggleProb, k);
  const noneVal = struggleEqns.none(struggleProb, k);

  const [inc, dec, none] = softmax([incVal, decVal, noneVal]);
  // console.log(`Inc: ${inc}, Dec: ${dec}, None: ${none}`);
  return {
    inc,
    dec,
    none,
  };
};

export { getSupportChangeLikelihoodModel };
