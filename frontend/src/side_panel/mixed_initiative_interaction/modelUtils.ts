import { UserStruggleEvidence } from '../models/support_and_MII/UserSupport';

const sum = (nums: number[]) => nums.reduce((total, num) => total + num, 0);

const getMax = <V, P>(
  values: V[],
  initialValue: V,
  getPropertyToCompare: (value: V) => P,
): V =>
  values.reduce(
    (prevBest, current) =>
      getPropertyToCompare(current) > getPropertyToCompare(prevBest)
        ? current
        : prevBest,
    initialValue,
  );

const softmax = (items: number[]): number[] => {
  const maxVal = getMax<number, number>(items, items[0], (item) => item);
  const exps = items.map((value) => Math.exp(value) - maxVal);
  const total = sum(exps);
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
    timeSinceInteraction: newEvidence.timeSinceInteraction,
    levelOfSupport: newEvidence.levelOfSupport,
  };
};

export { softmax, sum, getMax, computeMovingAverage };
