import Button from '@mui/material/Button/Button';
import Input from '@mui/material/Input/Input';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import {
  useNavigationContext,
  useUnpublishedScriptContext,
} from '../../../contexts/contextHooks';
import { useState } from 'react';
import { EditorActionType } from '../../../models/EditorAction';
import { useConfirm } from 'material-ui-confirm';
import { StateSetter } from '../../../models/utilTypes';
import typeCheck, { TypeCheckError } from '../../../models/CST/typeCheck';
import {
  onDeleteUnpublishedScript,
  onSaveUnpublishedScript,
  onPublishUnpublishedScript,
} from '../script_utils/updateUnpublishedScript';

interface UnpublishedscriptDetailsProps {
  setSnackBar: StateSetter<{ open: boolean; message: string; error: boolean }>;
  setTypeErrors: StateSetter<TypeCheckError[]>;
}

const UnpublishedScriptDetails: React.FC<UnpublishedscriptDetailsProps> = ({
  setSnackBar,
  setTypeErrors,
}) => {
  const { unpublishedScript, dispatch } = useUnpublishedScriptContext();
  const { goBack } = useNavigationContext();
  const confirm = useConfirm();
  const [title, setTitle] = useState(unpublishedScript.title);
  const [description, setDescription] = useState(
    unpublishedScript.description ?? '',
  );
  const createdAtDate = new Date(unpublishedScript.created_at);
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
            dispatch({ type: EditorActionType.EditScriptTitle, title });
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
            Author: {unpublishedScript.author.name}
          </Typography>
          <Typography variant={'subtitle2'}>Created: {dateString}</Typography>
          <Button
            variant={'text'}
            sx={{ padding: 0 }}
            onClick={async () => {
              const { confirmed } = await confirm({
                description: 'Deleting the script is a permanent action',
              });
              if (confirmed) {
                const response = await onDeleteUnpublishedScript(
                  unpublishedScript,
                  setSnackBar,
                );
                if (response.status === 'Loaded') {
                  setTimeout(goBack, 3000);
                }
              }
            }}
          >
            <Typography variant={'subtitle2'}>Delete Script</Typography>
          </Button>
        </Stack>
        <Input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => {
            dispatch({
              type: EditorActionType.EditScriptDescription,
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
            onSaveUnpublishedScript(unpublishedScript, setSnackBar)
          }
        >
          Save
        </Button>
        <Button
          sx={{ width: '100%' }}
          variant={'contained'}
          onClick={() => {
            const typeCheckResult = typeCheck(unpublishedScript.program);
            if (typeCheckResult.success === false) {
              setTypeErrors(typeCheckResult.errors);
            } else {
              onPublishUnpublishedScript(
                unpublishedScript,
                typeCheckResult.program,
                setSnackBar,
              );
            }
          }}
        >
          Publish Script
        </Button>
      </Stack>
    </>
  );
};

export default UnpublishedScriptDetails;
