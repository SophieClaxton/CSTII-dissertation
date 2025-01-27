import { UserModel, UtilityModel } from '../mixedInitiativeInteraction';
import {
  SystemSupportAction,
  UserStruggleEvidence,
  UserSupportAction,
} from './userSupportMII';

const userStruggleUserModel: UserModel<
  UserSupportAction,
  UserStruggleEvidence
> = (_goal: UserSupportAction, _evidence: UserStruggleEvidence) => 1;

const userStruggleUtilityModel: UtilityModel<
  SystemSupportAction,
  UserSupportAction
> = (action: SystemSupportAction, _goal: UserSupportAction) =>
  action === 'none' ? 1 : 0;

export { userStruggleUserModel, userStruggleUtilityModel };
