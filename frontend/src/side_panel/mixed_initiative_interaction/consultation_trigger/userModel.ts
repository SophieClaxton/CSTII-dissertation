import {
  UserStruggleEvidence,
  StruggleProbModel,
  InteractionData,
  LevelOfSupport,
  levelsOfSupport,
} from '../../models/support_and_MII/UserSupport';
import * as lodash from 'lodash';
import { computeMovingAverage, softmax } from '../modelUtils';
import { UserModel } from '../mixedInitiativeInteraction';
import {
  ConsultationTriggerGoal,
  SupportProblemProbEqn,
} from '../../models/support_and_MII/ConsultationTriggerMII';

const tempStruggleModel: StruggleProbModel = (_data: InteractionData) => 0.75;

const defautlFeedbackGoalProbEquations: Record<
  ConsultationTriggerGoal,
  SupportProblemProbEqn
> = {
  send: (struggleProb, l, k) =>
    ((0.5 * (2.5 * l + 1)) / (k + 1)) * (Math.exp(struggleProb - 0.4) - 1),
  none: (struggleProb, l, k) =>
    ((0.25 * (k + 1)) / (2.5 * l + 1)) * (Math.exp(-struggleProb + 1) - 1),
};

const getConsultationTriggerUserModel = (
  levelOfSupport: LevelOfSupport,
  struggleModel: StruggleProbModel = tempStruggleModel,
  alpha: number = 0.7,
  struggleEqns: Record<
    ConsultationTriggerGoal,
    SupportProblemProbEqn
  > = defautlFeedbackGoalProbEquations,
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
      levelOfSupport,
      struggleEqns,
    );
    return probabilities[goal];
  };
};

const computeUserGoalProbabilities = (
  struggleModel: StruggleProbModel,
  movingEvidenceAverage: UserStruggleEvidence,
  levelOfSupport: LevelOfSupport,
  struggleEqns: Record<ConsultationTriggerGoal, SupportProblemProbEqn>,
): Record<ConsultationTriggerGoal, number> => {
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

export { getConsultationTriggerUserModel };
