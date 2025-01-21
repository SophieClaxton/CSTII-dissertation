import { useEffect, useState } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import './styles/program.css';
import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import {
  useUnpublishedScriptContext,
  createTypeErrorsContext,
} from '../../contexts/contextHooks';
import { TypeErrorsContext } from '../../contexts/TypeErrorsContext';
import typeCheck, { TypeCheckError } from '../../models/CST/typeCheck';
import { getEdges } from '../flowUtils/getEdges';
import {
  onPublishUnpublishedScript,
  onSaveUnpublishedScript,
} from '../scriptUtils/updateUnpublishedScript';
import AlertSnackBar from './AlertSnackBar';
import SectionNode from './CST/SectionNode';
import { addClickedElementListener } from '../../../common/receiveMessage';
import Typography from '@mui/material/Typography/Typography';
import Input from '@mui/material/Input/Input';
import { EditorActionType } from '../../models/EditorAction';
import Box from '@mui/material/Box/Box';

const ScriptEditor: React.FC = () => {
  const { unpublishedScript, dispatch } = useUnpublishedScriptContext();
  const createdAtDate = new Date(unpublishedScript.created_at);
  const dateString = createdAtDate.toLocaleDateString();

  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    error: false,
  });
  const [typeErrors, setTypeErrors] = useState<TypeCheckError[]>([]);
  const [title, setTitle] = useState(unpublishedScript.title);
  const [description, setDescription] = useState(
    unpublishedScript.description ?? '',
  );

  const edges = getEdges(unpublishedScript.program.sections);

  const updateArrows = useXarrow();

  useEffect(() => addClickedElementListener(dispatch), [dispatch]);

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
            console.log(typeCheckResult);
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
      <Box
        sx={{
          backgroundColor: 'grey.100',
        }}
        className="program-code-env"
        onScroll={updateArrows}
      >
        <div
          className="program-code"
          style={{ paddingRight: typeErrors.length > 0 ? '10rem' : '0' }}
        >
          <Xwrapper>
            <div className="start-block" id="start">
              START
            </div>
            <TypeErrorsContext.Provider
              value={createTypeErrorsContext(typeErrors)}
            >
              {unpublishedScript.program.sections.map((section) => (
                <SectionNode section={section} />
              ))}
            </TypeErrorsContext.Provider>
            {edges.map((edge) => (
              <Xarrow
                start={edge.source}
                end={edge.target}
                startAnchor={'bottom'}
                endAnchor={'top'}
              />
            ))}
          </Xwrapper>
        </div>
        <AlertSnackBar snackBar={snackBar} setSnackBar={setSnackBar} />
      </Box>
    </>
  );
};

export default ScriptEditor;
