import { UserStruggleData } from '../../../../messaging/message';
import {
  UserSupportAction,
  UserStruggleEvidence,
  SystemSupportAction,
  systemSupportActions,
  userSupportActions,
} from '../../../models/UserSupport';
import {
  getActionMaximisingExpectedUtility,
  UserModel,
  UtilityModel,
} from '../mixedInitiativeInteraction';

const userStruggleUserModel: UserModel<
  UserSupportAction,
  UserStruggleEvidence
> = (_goal: UserSupportAction, _evidence: UserStruggleEvidence) => 1;

const userStruggleUtilityModel: UtilityModel<
  SystemSupportAction,
  UserSupportAction
> = (action: SystemSupportAction, _goal: UserSupportAction) =>
  action === 'none' ? 1 : 0;

const getNextSystemSupportAction = (
  userStruggleData: UserStruggleData,
  deltaStepsCompleted: number,
) => {
  return getActionMaximisingExpectedUtility<
    SystemSupportAction,
    UserSupportAction,
    UserStruggleEvidence
  >(
    systemSupportActions,
    { userStruggleData, deltaStepsCompleted },
    userSupportActions,
    userStruggleUserModel,
    userStruggleUtilityModel,
  );
};

export { getNextSystemSupportAction };
