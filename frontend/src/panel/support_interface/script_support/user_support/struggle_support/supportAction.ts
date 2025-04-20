import { UserStruggleData } from '../../../../../messaging/message';
import { LevelOfSupport } from '../../../../models/UserSupport';
import { StateSetter } from '../../../../models/utilTypes';
import { SupportDialogProps } from '../../components/SupportDialog';
import {
  increaseLevelOfSupport,
  decreaseLevelOfSupport,
} from '../levelOfSupportUtils';
import { getNextStruggleSupportAction } from './userSupportMII';

const performBestSystemAction = (
  userStruggleData: UserStruggleData,
  levelOfSupport: LevelOfSupport,
  deltaStepsCompleted: number,
  setLevelOfSupport: StateSetter<LevelOfSupport>,
  setSupportDialogDetails: StateSetter<SupportDialogProps>,
) => {
  const nextAction = getNextStruggleSupportAction(
    userStruggleData,
    deltaStepsCompleted,
    levelOfSupport,
  );
  switch (nextAction) {
    case 'inc':
      return setLevelOfSupport(increaseLevelOfSupport);
    case 'dec':
      return setLevelOfSupport(decreaseLevelOfSupport);
    case 'none':
      return;
    case 'inc_dialog':
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        aboutChange: 'inc',
        onAction: () => setLevelOfSupport(increaseLevelOfSupport),
      }));
    case 'dec_dialog':
      return setSupportDialogDetails((prev) => ({
        ...prev,
        open: true,
        aboutChange: 'dec',
        onAction: () => setLevelOfSupport(decreaseLevelOfSupport),
      }));
  }
};

export { performBestSystemAction };
