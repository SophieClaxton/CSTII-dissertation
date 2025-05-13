import {
  updateTaskWorkflow,
  publishTaskWorkflow,
} from '../../../api/taskWorkflows';
import {
  updateUnpublishedTaskWorkflow as updateUnpublishedWorkflow,
  deleteUnpublishedTaskWorkflow,
} from '../../../api/unpublishedTaskWorkflows';
import { getWebsites, createWebsite } from '../../../api/websites';
import {
  UnpublishedTaskWorkflow,
  UpdateUnpublishedTaskWorkflowRequest,
} from '../../../models/api/UnpublishedTaskWorkflow';
import Website from '../../../models/api/Website';
import { ASTProgram } from '../../../models/AST/AST';
import { StateSetter } from '../../../models/utilTypes';
import { SnackBarDetails } from '../components/AlertSnackBar';

const onSaveUnpublishedWorkflow = async (
  unpublishedWorkflow: UnpublishedTaskWorkflow,
  setSnackBar: StateSetter<SnackBarDetails>,
) => {
  const update: UpdateUnpublishedTaskWorkflowRequest = {
    title: unpublishedWorkflow.title,
    description: unpublishedWorkflow.description,
    program: unpublishedWorkflow.program,
    published_script_id: unpublishedWorkflow.published_script_id,
  };
  const response = await updateUnpublishedWorkflow(
    unpublishedWorkflow.id,
    update,
  );
  setSnackBar({
    open: true,
    message: `Save ${response.status === 'Loaded' ? 'successful' : 'unsuccessful'}`,
    error: response.status != 'Loaded',
  });
};

const findWorkflowWebsite = async (
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

const onPublishUnpublishedWorkflow = async (
  unpublishedWorkflow: UnpublishedTaskWorkflow,
  program: ASTProgram,
  setSnackBar: StateSetter<SnackBarDetails>,
) => {
  const errorMsg = {
    open: true,
    message: 'Failed to publish task workflow',
    error: true,
  };
  const successMsg = {
    open: true,
    message: 'Published task workflow',
    error: false,
  };

  const website =
    unpublishedWorkflow.website &&
    unpublishedWorkflow.website.url === program.start.url
      ? unpublishedWorkflow.website
      : await findWorkflowWebsite(program);
  console.log(website);

  if (website) {
    if (unpublishedWorkflow.published_script_id) {
      const response = await updateTaskWorkflow(
        unpublishedWorkflow.published_script_id,
        {
          title: unpublishedWorkflow.title,
          description: unpublishedWorkflow.description ?? '',
          program: program,
          website_id: website.id,
        },
      );
      if (response.status === 'Loaded') {
        onSaveUnpublishedWorkflow(unpublishedWorkflow, () =>
          setSnackBar(successMsg),
        );
      } else {
        setSnackBar(errorMsg);
      }
    } else {
      const response = await publishTaskWorkflow({
        title: unpublishedWorkflow.title,
        author_id: unpublishedWorkflow.author.id,
        created_at: unpublishedWorkflow.created_at,
        description: '',
        program: program,
        website_id: website.id,
      });
      if (response.status === 'Loaded') {
        onSaveUnpublishedWorkflow(
          { ...unpublishedWorkflow, published_script_id: response.data.id },
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

const onDeleteUnpublishedWorkflow = async (
  unpublishedWorkflow: UnpublishedTaskWorkflow,
  setSnackBar: StateSetter<SnackBarDetails>,
) => {
  const response = await deleteUnpublishedTaskWorkflow(unpublishedWorkflow.id);
  setSnackBar({
    open: true,
    message: `Delete ${response.status === 'Loaded' ? 'successful' : 'unsuccessful'}`,
    error: response.status != 'Loaded',
  });
  return response;
};

export {
  onSaveUnpublishedWorkflow,
  onPublishUnpublishedWorkflow,
  onDeleteUnpublishedWorkflow,
};
