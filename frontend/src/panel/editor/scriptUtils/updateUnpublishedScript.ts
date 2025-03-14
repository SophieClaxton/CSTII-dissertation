import { publishScript, updateScript } from '../../api/scripts';
import { updateUnpublishedScript } from '../../api/unpublishedScripts';
import { getWebsites, createWebsite } from '../../api/websites';
import {
  UnpublishedScript,
  UpdateUnpublishedScriptRequest,
} from '../../models/API/UnpublishedScript';
import Website from '../../models/API/Website';
import { ASTProgram } from '../../models/AST/AST';
import { StateSetter } from '../../models/utilTypes';
import { SnackBarDetails } from '../components/AlertSnackBar';

const onSaveUnpublishedScript = async (
  unpublishedScript: UnpublishedScript,
  setSnackBar: StateSetter<SnackBarDetails>,
) => {
  const update: UpdateUnpublishedScriptRequest = {
    title: unpublishedScript.title,
    description: unpublishedScript.description,
    program: unpublishedScript.program,
    published_script_id: unpublishedScript.published_script_id,
  };
  const response = await updateUnpublishedScript(unpublishedScript.id, update);
  setSnackBar({
    open: true,
    message: `Save ${response.status === 'Loaded' ? 'successful' : 'unsuccessful'}`,
    error: response.status != 'Loaded',
  });
};

const findScriptWebsite = async (
  program: ASTProgram,
): Promise<Website | undefined> => {
  const websitesData = await getWebsites();
  if (websitesData.status === 'Loaded') {
    const websiteMatch = websitesData.data
      .filter((website) => website.url === program.start.url)
      .at(0);
    if (websiteMatch) {
      console.log('Found existing website');
      return websiteMatch;
    } else {
      // TODO: ask helper to enter description for website
      const createWebsiteResponse = await createWebsite({
        url: program.start.url,
        description: '',
      });
      if (createWebsiteResponse.status === 'Loaded') {
        console.log('Created new website');
        return createWebsiteResponse.data;
      } else {
        console.log('Could not create website');
        return undefined;
      }
    }
  }
};

const onPublishUnpublishedScript = async (
  unpublishedScript: UnpublishedScript,
  program: ASTProgram,
  setSnackBar: StateSetter<SnackBarDetails>,
) => {
  const errorMsg = {
    open: true,
    message: 'Failed to publish script',
    error: true,
  };
  const successMsg = {
    open: true,
    message: 'Published script',
    error: false,
  };

  const website =
    unpublishedScript.website &&
    unpublishedScript.website.url === program.start.url
      ? unpublishedScript.website
      : await findScriptWebsite(program);
  console.log(website);

  if (website) {
    if (unpublishedScript.published_script_id) {
      const response = await updateScript(
        unpublishedScript.published_script_id,
        {
          title: unpublishedScript.title,
          description: unpublishedScript.description ?? '',
          program: program,
          website_id: website.id,
        },
      );
      if (response.status === 'Loaded') {
        onSaveUnpublishedScript(unpublishedScript, () =>
          setSnackBar(successMsg),
        );
      } else {
        setSnackBar(errorMsg);
      }
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
        onSaveUnpublishedScript(
          { ...unpublishedScript, published_script_id: response.data.id },
          () => setSnackBar(successMsg),
        );
      } else {
        setSnackBar(errorMsg);
      }
    }
  } else {
    setSnackBar(errorMsg);
  }
};

export { onSaveUnpublishedScript, onPublishUnpublishedScript };
