import {
  UserStruggleEvidence,
  StruggleProbModel,
  InteractionData,
} from '../../models/support_and_MII/UserSupport';
import * as lodash from 'lodash';
import { computeMovingAverage, softmax } from '../modelUtils';
import { UserModel } from '../mixedInitiativeInteraction';
import {
  MetacognitiveSupportGoal,
  SupportLevelProbEqn,
} from '../../models/support_and_MII/MetacognitiveSupportMII';

const tempStruggleModel: StruggleProbModel = (_data: InteractionData) => 0.6;

const defautlSupportLevelProbEquations: Record<
  MetacognitiveSupportGoal,
  SupportLevelProbEqn
> = {
  inc: (p, k, l) => {
    switch (l) {
      case 'text':
        return 6 * (0.2 + p) * Math.exp(-0.5 * k);
      case 'hints':
        return 6 * (1 + p) * Math.exp(-0.75 * k);
      case 'auto':
        return -Infinity;
    }
  },
  none: (p, k, l) => {
    switch (l) {
      case 'text':
        return 6 * (0.7 - 0.65 * p) * Math.exp(0.5 * k);
      case 'hints':
        return 6 * (1.5 - 0.5 * p) * Math.exp((-0.25 * k) / 6);
      case 'auto':
        return 6 * (0.05 + 0.2 * p) * Math.exp((p - 1.2) * (k - 1));
    }
  },
  dec: (p, k, l) => {
    switch (l) {
      case 'text':
        return -Infinity;
      case 'hints':
        return 6 * (0.6 - 0.3 * p) * Math.exp(0.5 * (1 - p) * (k - 1));
      case 'auto':
        return 6 * (0.25 - 0.2 * p) * Math.exp(0.5 * (k - 1));
    }
  },
};

const getSupportChangeUserModel = (
  struggleModel: StruggleProbModel = tempStruggleModel,
  alpha: number = 0.7,
  struggleEqns: Record<
    MetacognitiveSupportGoal,
    SupportLevelProbEqn
  > = defautlSupportLevelProbEquations,
): UserModel<MetacognitiveSupportGoal, UserStruggleEvidence> => {
  let movingEvidenceAverage: UserStruggleEvidence | undefined = undefined;
  let lastEvidence: UserStruggleEvidence | undefined = undefined;
  let probabilities: Record<MetacognitiveSupportGoal, number> = {
    inc: 0,
    dec: 0,
    none: 0,
  };

  return (goal: MetacognitiveSupportGoal, evidence: UserStruggleEvidence) => {
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

const computeUserGoalProbabilities = (
  struggleModel: StruggleProbModel,
  movingEvidenceAverage: UserStruggleEvidence,
  struggleEqns: Record<MetacognitiveSupportGoal, SupportLevelProbEqn>,
): Record<MetacognitiveSupportGoal, number> => {
  const p = struggleModel(movingEvidenceAverage);
  // console.log(`Struggle prob: ${p}`);
  const k = movingEvidenceAverage.stepsCompleted;
  const l = movingEvidenceAverage.levelOfSupport;

  const incVal = struggleEqns.inc(p, k, l);
  const decVal = struggleEqns.dec(p, k, l);
  const noneVal = struggleEqns.none(p, k, l);

  const [inc, dec, none] = softmax([incVal, decVal, noneVal]);
  // console.log(`Inc: ${inc}, Dec: ${dec}, None: ${none}`);
  return {
    inc,
    dec,
    none,
  };
};

export { getSupportChangeUserModel };
