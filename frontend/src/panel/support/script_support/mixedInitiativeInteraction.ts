type UserModel<G, E> = (goal: G, evidence: E) => number;

type UtilityModel<A, G> = (action: A, goal: G) => number;

type EUResult<A> = { action: A; EU: number };

const sum = (nums: number[]) => nums.reduce((total, num) => total + num, 0);

const getExpectedUtility = <A, G, E>(
  action: A,
  evidence: E,
  possibleGoals: readonly G[],
  userModel: UserModel<G, E>,
  utilityModel: UtilityModel<A, G>,
): number => {
  const productsForGoals = possibleGoals.map(
    (goal) => userModel(goal, evidence) * utilityModel(action, goal),
  );
  return sum(productsForGoals);
};

const getActionMaximisingExpectedUtility = <A, G, E>(
  possibleActions: readonly A[],
  evidence: E,
  possibleGoals: readonly G[],
  userModel: UserModel<G, E>,
  utilityModel: UtilityModel<A, G>,
): A => {
  if (possibleActions.length === 0) {
    throw new Error('No actions to consider');
  }

  const results: EUResult<A>[] = possibleActions.map((action) => ({
    action,
    EU: getExpectedUtility(
      action,
      evidence,
      possibleGoals,
      userModel,
      utilityModel,
    ),
  }));
  console.log(results);

  const [baseAction] = possibleActions;
  const { action }: EUResult<A> = results.reduce(
    (prevBest, current) => (current.EU > prevBest.EU ? current : prevBest),
    { action: baseAction, EU: 0 },
  );

  return action;
};

export { getActionMaximisingExpectedUtility };
export type { UserModel, UtilityModel };
