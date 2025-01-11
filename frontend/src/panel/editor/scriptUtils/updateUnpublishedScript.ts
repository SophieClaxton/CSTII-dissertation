import { updateUnpublishedScript } from '../../api/unpublishedScripts';
import {
  UnpublishedScript,
  UpdateUnpublishedScriptRequest,
} from '../../models/API/UnpublishedScript';
import { SnackBarDetails } from '../components/AlertSnackBar';

const saveUnpublishedScript = (
  unpublishedScript: UnpublishedScript,
  setSnackBar: (value: SnackBarDetails) => void,
) => {
  const saveScript = async () => {
    const update: UpdateUnpublishedScriptRequest = {
      program: unpublishedScript.program,
    };
    const response = await updateUnpublishedScript(
      unpublishedScript.id,
      update,
    );
    setSnackBar({
      open: true,
      message: `Save ${response.status === 'Loaded' ? 'successful' : 'unsuccessful'}`,
      error: response.status != 'Loaded',
    });
  };
  saveScript();
};

export { saveUnpublishedScript };
