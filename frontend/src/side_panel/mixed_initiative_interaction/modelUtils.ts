import { UserStruggleEvidence } from '../models/support_and_MII/UserSupport';

const softmax = (items: number[]): number[] => {
  const exps = items.map(Math.exp);
  const total = exps.reduce((prev, curr) => prev + curr, 0);
  return exps.map((item) => item / total);
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

export { softmax, computeMovingAverage };
