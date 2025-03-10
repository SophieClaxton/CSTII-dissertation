import { UserStruggleData } from '../../../../messaging/message';
import {
  UserSupportAction,
  UserStruggleEvidence,
  SystemSupportAction,
  systemSupportActions,
  userSupportActions,
  LevelOfSupport,
  levelsOfSupport,
} from '../../../models/UserSupport';
import {
  getActionMaximisingExpectedUtility,
  UserModel,
  UtilityModel,
} from '../mixedInitiativeInteraction';
import { Vector } from 'ts-matrix';
import * as lodash from 'lodash';

const linearModel = (parameters: Vector, data: Vector): number => {
  if (parameters.rows != data.rows) {
    throw new Error(
      `Could not run model, dimensions do not match\nParameters: ${parameters.values}, Data: ${data.values}`,
    );
  }

  return parameters.dot(data);
};

const softmax = (item: number, items: number[]) =>
  Math.exp(item) /
  items.map((item) => Math.exp(item)).reduce((a, b) => a + b, 0);

const getProbabilities = (
  parameters: Record<UserSupportAction, Vector>,
  data: Vector,
): Record<UserSupportAction, number> => {
  const modelResults: Record<UserSupportAction, number> = {
    inc: linearModel(parameters.inc, data),
    dec: linearModel(parameters.dec, data),
    none: linearModel(parameters.none, data),
  };
  const allResults = Object.values(modelResults);
  console.log('all results');
  console.log(allResults);
  return {
    inc: softmax(modelResults.inc, allResults),
    dec: softmax(modelResults.dec, allResults),
    none: softmax(modelResults.none, allResults),
  };
};

const getUserStruggleUserModel: (
  getCurrentLevelOfSupport: () => LevelOfSupport,
) => UserModel<UserSupportAction, UserStruggleEvidence> = (
  getCurrentLevelOfSupport,
) => {
  const alpha = 0.7;
  const movingEvidenceAverage: UserStruggleEvidence = {
    totalDistance: 0,
    totalScrollDistance: 0,
    numMouseClicks: 0,
    deltaStepsCompleted: 0,
  };
  let lastEvidence: UserStruggleEvidence | undefined = undefined;
  const parameters: Record<UserSupportAction, Vector> = {
    inc: new Vector([0.003, 0.5, 4, 1, -1]),
    dec: new Vector([0.0001, -0.1, 4, 5, 3]),
    none: new Vector([0.0015, 0.1, 2, 2, 1]),
  };
  let probabilities: Record<UserSupportAction, number> = {
    inc: 0,
    dec: 0,
    none: 0,
  };

  return (goal: UserSupportAction, evidence: UserStruggleEvidence) => {
    if (lodash.isEqual(evidence, lastEvidence)) {
      return probabilities[goal];
    }
    lastEvidence = evidence;
    let evidenceItem: keyof UserStruggleEvidence;
    for (evidenceItem in evidence) {
      movingEvidenceAverage[evidenceItem] =
        alpha * evidence[evidenceItem] +
        (1 - alpha) * movingEvidenceAverage[evidenceItem];
    }
    const levelOfSupport = levelsOfSupport.indexOf(getCurrentLevelOfSupport());
    const evidenceData = new Vector([
      ...Object.values(movingEvidenceAverage),
      levelOfSupport,
    ]);

    probabilities = getProbabilities(parameters, evidenceData);
    console.log('Probabilities');
    console.log(probabilities);
    return probabilities[goal];
  };
};

const userStruggleUtilityModel: UtilityModel<
  SystemSupportAction,
  UserSupportAction
> = (action: SystemSupportAction, _goal: UserSupportAction) =>
  action === 'none' ? 1 : 0;

const getNextSystemSupportAction = (
  userStruggleData: UserStruggleData,
  deltaStepsCompleted: number,
  getCurrentLevelOfSupport: () => LevelOfSupport,
): SystemSupportAction => {
  const evidence = { ...userStruggleData, deltaStepsCompleted };
  console.log(evidence);
  return getActionMaximisingExpectedUtility<
    SystemSupportAction,
    UserSupportAction,
    UserStruggleEvidence
  >(
    systemSupportActions,
    evidence,
    userSupportActions,
    getUserStruggleUserModel(getCurrentLevelOfSupport),
    userStruggleUtilityModel,
  );
};

export { getNextSystemSupportAction, softmax };
