import { publishScript } from '../../api/scripts';
import { updateUnpublishedScript } from '../../api/unpublishedScripts';
import { getWebsites, createWebsite } from '../../api/websites';
import {
  UnpublishedScript,
  UpdateUnpublishedScriptRequest,
} from '../../models/API/UnpublishedScript';
import { ASTProgram } from '../../models/AST/AST';
import { SnackBarDetails } from '../components/AlertSnackBar';

const onSaveUnpublishedScript = (
  unpublishedScript: UnpublishedScript,
  setSnackBar: (value: SnackBarDetails) => void,
) => {
  const saveScript = async () => {
    const update: UpdateUnpublishedScriptRequest = {
      title: unpublishedScript.title,
      description: unpublishedScript.description,
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

const onPublishUnpublishedScript = async (
  unpublishedScript: UnpublishedScript,
  program: ASTProgram,
  setSnackBar: (value: SnackBarDetails) => void,
) => {
  const errorMsg = {
    open: true,
    message: 'Failed to publish script',
    error: true,
  };
  const websites = await getWebsites();
  if (websites.status === 'Loaded') {
    let website = websites.data
      .filter((website) => website.url === program.start.url)
      .at(0);
    if (!website) {
      // TODO: ask helper to enter description for website
      const websiteResponse = await createWebsite({
        url: program.start.url,
        description: '',
      });
      if (websiteResponse.status === 'Loaded') {
        website = websiteResponse.data;
      }
    }
    if (!website) {
      setSnackBar(errorMsg);
    } else {
      const response = await publishScript({
        title: unpublishedScript.title,
        author_id: unpublishedScript.author.id,
        created_at: unpublishedScript.created_at,
        description: '',
        program: program,
        website_id: website.id,
      });
      if (response.status === 'Loaded') {
        setSnackBar({
          open: true,
          message: 'Script Published',
          error: false,
        });
      }
    }
  } else {
    setSnackBar(errorMsg);
  }
};

export { onSaveUnpublishedScript, onPublishUnpublishedScript };
