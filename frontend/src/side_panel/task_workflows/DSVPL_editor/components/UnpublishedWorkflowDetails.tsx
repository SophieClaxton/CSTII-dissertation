import Button from '@mui/material/Button/Button';
import Input from '@mui/material/Input/Input';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import {
  createSyntaxErrorsContext,
  useNavigationContext,
  useUnpublishedWorkflowContext,
} from '../../../contexts/contextHooks';
import { useState } from 'react';
import { EditorActionType } from '../../../models/EditorAction';
import { useConfirm } from 'material-ui-confirm';
import { StateSetter } from '../../../models/utilTypes';
import checkSyntax from '../../syntax_checker/checkSyntax';
import {
  onDeleteUnpublishedWorkflow,
  onSaveUnpublishedWorkflow,
  onPublishUnpublishedWorkflow,
} from '../task_workflow_utils/unpublishedTaskWorkflowUtils';
import { SyntaxErrorsInfo } from '../../../contexts/SyntaxErrorsContext';

interface UnpublishedWorkflowDetailsProps {
  setSnackBar: StateSetter<{ open: boolean; message: string; error: boolean }>;
  setSyntaxErrorsContext: StateSetter<SyntaxErrorsInfo>;
}

const UnpublishedWorkflowDetails: React.FC<UnpublishedWorkflowDetailsProps> = ({
  setSnackBar,
  setSyntaxErrorsContext,
}) => {
  const { unpublishedWorkflow, dispatch } = useUnpublishedWorkflowContext();
  const { goBack } = useNavigationContext();
  const confirm = useConfirm();
  const [title, setTitle] = useState(unpublishedWorkflow.title);
  const [description, setDescription] = useState(
    unpublishedWorkflow.description ?? '',
  );
  const createdAtDate = new Date(unpublishedWorkflow.created_at);
  const dateString = createdAtDate.toLocaleDateString();

  return (
    <>
      <Stack
        direction={'column'}
        sx={{
          gap: '0.25rem',
          width: '100%',
          padding: '0.5rem',
        }}
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={() => {
            dispatch({ type: EditorActionType.EditWorkflowTitle, title });
          }}
          disableUnderline
          inputProps={{
            sx: {
              typography: 'h4',
              height: 'fit-content',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              '&:hover': {
                outline: '1px solid #424242',
              },
              '&:focus': {
                outline: '2px solid #42a5f5',
              },
            },
          }}
          autoFocus
        />
        <Stack
          direction={'row'}
          spacing={3}
          sx={{ paddingLeft: '0.5rem', margin: '0 !important' }}
        >
          <Typography variant={'subtitle2'}>
            Author: {unpublishedWorkflow.author.name}
          </Typography>
          <Typography variant={'subtitle2'}>Created: {dateString}</Typography>
          <Button
            variant={'text'}
            sx={{ padding: 0 }}
            onClick={async () => {
              const { confirmed } = await confirm({
                description: 'Deleting the task workflow is a permanent action',
              });
              if (confirmed) {
                const response = await onDeleteUnpublishedWorkflow(
                  unpublishedWorkflow,
                  setSnackBar,
                );
                if (response.status === 'Loaded') {
                  setTimeout(goBack, 3000);
                }
              }
            }}
          >
            <Typography variant={'subtitle2'}>Delete Task Workflow</Typography>
          </Button>
        </Stack>
        <Input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => {
            dispatch({
              type: EditorActionType.EditWorkflowDescription,
              description,
            });
          }}
          placeholder={'Description'}
          multiline
          disableUnderline
          sx={{ margin: '0 !important', padding: '0' }}
          inputProps={{
            sx: {
              padding: '0.5rem',
              borderRadius: '0.25rem',
              '&:hover': {
                outline: '1px solid #424242',
              },
              '&:focus': {
                outline: '2px solid #42a5f5',
              },
            },
          }}
        />
      </Stack>
      <Stack
        direction={'row'}
        spacing={1}
        padding={'0.5rem'}
        width={'100%'}
        sx={{
          zIndex: 10,
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 6px 5px 0px',
        }}
      >
        <Button
          sx={{ width: '100%' }}
          variant={'contained'}
          onClick={() =>
            onSaveUnpublishedWorkflow(unpublishedWorkflow, setSnackBar)
          }
        >
          Save
        </Button>
        <Button
          sx={{ width: '100%' }}
          variant={'contained'}
          onClick={() => {
            const syntaxCheckResult = checkSyntax(unpublishedWorkflow.program);
            if (syntaxCheckResult.success === true) {
              onPublishUnpublishedWorkflow(
                unpublishedWorkflow,
                syntaxCheckResult.program,
                setSnackBar,
              );
            } else {
              setSnackBar({
                open: true,
                message: 'Cannot publish task workflow, there are still errors',
                error: true,
              });
            }
            setSyntaxErrorsContext(
              createSyntaxErrorsContext(
                syntaxCheckResult,
                !syntaxCheckResult.success,
              ),
            );
          }}
        >
          Publish Task Workflow
        </Button>
      </Stack>
    </>
  );
};

export default UnpublishedWorkflowDetails;
