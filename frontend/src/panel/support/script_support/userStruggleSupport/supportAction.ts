import { UserStruggleData } from '../../../../common/message';
import { StateSetter } from '../../../models/utilTypes';
import { SupportDialogProps } from '../components/SupportDialog';
import {
  increaseLevelOfSupport,
  decreaseLevelOfSupport,
} from './levelOfSupportUtils';
import { getNextSystemSupportAction, LevelOfSupport } from './userSupportMII';

const performBestSystemAction = (
  userStruggleData: UserStruggleData,
  setLevelOfSupport: StateSetter<LevelOfSupport>,
  setSupportDialogDetails: StateSetter<SupportDialogProps>,
) => {
  const nextAction = getNextSystemSupportAction(userStruggleData, 0);
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
