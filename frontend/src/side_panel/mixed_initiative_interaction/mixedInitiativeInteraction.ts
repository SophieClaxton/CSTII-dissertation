import { sum } from 'lodash';
import { getMax } from './modelUtils';

/** User model returns the probability of the goal given the evidence.
 * The sum of the probabilities of all the possible goals should sum to 1
 */
type UserModel<G, E> = (goal: G, evidence: E) => number;

/** Utility of a paritcular action A given goal G should be a number in the range [0, 1] */
type UtilityModel<A, G> = (action: A, goal: G) => number;

type EUResult<A> = { action: A; EU: number };

interface MII<E, A> {
  getBestAction: (evidence: E) => A;
}

interface MIIDetails<A, G, E> {
  goalLikelihoodModel: UserModel<G, E>;
  utilityModel: UtilityModel<A, G>;
  actions: readonly A[];
  goals: readonly G[];
}

const getExpectedUtility = <A, G, E>(
  action: A,
  evidence: E,
  details: MIIDetails<A, G, E>,
): number => {
  const products = details.goals.map(
    (goal) =>
      details.goalLikelihoodModel(goal, evidence) *
      details.utilityModel(action, goal),
  );
  return sum(products);
};

const getMII = <A, G, E>(details: MIIDetails<A, G, E>): MII<E, A> => {
  const { actions, goals } = details;
  if (actions.length === 0) {
    throw new Error('No actions to consider');
  }
  if (goals.length === 0) {
    throw new Error('No goals to consider');
  }

  return {
    getBestAction: (evidence: E) => {
      const results: EUResult<A>[] = actions.map((action) => ({
        action,
        EU: getExpectedUtility(action, evidence, details),
      }));
      console.log(results);

      const [baseAction] = actions;
      const bestAction = getMax(
        results,
        { action: baseAction, EU: 0 },
        (result) => result.EU,
      ).action;
      return bestAction;
    },
  };
};

export { getMII };
export type { UserModel, UtilityModel, MII };
