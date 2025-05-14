import {
  UserStruggleEvidence,
  StruggleProbModel,
  InteractionData,
} from '../../models/support_and_MII/UserSupport';
import * as lodash from 'lodash';
import { computeMovingAverage, softmax } from '../modelUtils';
import { UserModel } from '../mixedInitiativeInteraction';
import {
  ConsultationTriggerGoal,
  SupportProblemProbEqn,
} from '../../models/support_and_MII/ConsultationTriggerMII';

const tempStruggleModel: StruggleProbModel = (_data: InteractionData) => 0.75;

const defautlSupportProblemProbEquations: Record<
  ConsultationTriggerGoal,
  SupportProblemProbEqn
> = {
  send: (p, k, l) => {
    switch (l) {
      case 'text':
        return -3 * (1.5 - p) * Math.exp(2 * k);
      case 'hints':
        return (p - 0.65) * Math.exp(-0.75 * (k - 1 - p));
      case 'auto':
        return 2 * p * Math.exp(-0.375 * (k - 1));
    }
  },
  none: (_p, k, l) => {
    switch (l) {
      case 'text':
        return Math.exp(k);
      case 'hints':
        return Math.exp(0.75 * k);
      case 'auto':
        return 1.75 * Math.exp(0.375 * k);
    }
  },
};

const getConsultationTriggerUserModel = (
  struggleModel: StruggleProbModel = tempStruggleModel,
  alpha: number = 0.7,
  struggleEqns: Record<
    ConsultationTriggerGoal,
    SupportProblemProbEqn
  > = defautlSupportProblemProbEquations,
): UserModel<ConsultationTriggerGoal, UserStruggleEvidence> => {
  let movingEvidenceAverage: UserStruggleEvidence | undefined = undefined;
  let lastEvidence: UserStruggleEvidence | undefined = undefined;
  let probabilities: Record<ConsultationTriggerGoal, number> = {
    send: 0,
    none: 0,
  };

  return (goal: ConsultationTriggerGoal, evidence: UserStruggleEvidence) => {
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
  struggleEqns: Record<ConsultationTriggerGoal, SupportProblemProbEqn>,
): Record<ConsultationTriggerGoal, number> => {
  const p = struggleModel(movingEvidenceAverage);
  // console.log(`Struggle prob: ${p}`);
  const k = movingEvidenceAverage.stepsCompleted;
  const l = movingEvidenceAverage.levelOfSupport;

  const sendVal = struggleEqns.send(p, k, l);
  const noneVal = struggleEqns.none(p, k, l);

  const [send, none] = softmax([sendVal, noneVal]);
  // console.log(`Send: ${send}, None: ${none}`);
  return {
    send,
    none,
  };
};

export { getConsultationTriggerUserModel };
