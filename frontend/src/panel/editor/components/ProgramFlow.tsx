import { useState } from 'react';
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
import { saveUnpublishedScript } from '../scriptUtils/updateUnpublishedScript';
import AlertSnackBar from './AlertSnackBar';
import SectionNode from './CST/SectionNode';

const ProgramFlow: React.FC = () => {
  const { unpublishedScript } = useUnpublishedScriptContext();
  const createdAtDate = new Date(unpublishedScript.created_at);
  const dateString = createdAtDate.toLocaleDateString();

  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    error: false,
  });

  const [typeErrors, setTypeErrors] = useState<TypeCheckError[]>([]);

  const edges = getEdges(unpublishedScript.program.sections);

  const updateArrows = useXarrow();

  return (
    <>
      <div className="program-meta-data">
        <h2>{unpublishedScript.title}</h2>
        <h3>{unpublishedScript.author.name}</h3>
        <h3>{dateString}</h3>
      </div>
      <Stack direction={'row'} spacing={1}>
        <Button
          variant={'contained'}
          onClick={() => saveUnpublishedScript(unpublishedScript, setSnackBar)}
        >
          Save
        </Button>
        <Button
          variant={'contained'}
          onClick={() => {
            const typeCheckResult = typeCheck(unpublishedScript.program);
            if (!typeCheckResult.success) {
              setTypeErrors(typeCheckResult.errors);
            }
          }}
        >
          Publish Script
        </Button>
      </Stack>
      <div className="program-code-env" onScroll={updateArrows}>
        <div className="program-code">
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
      </div>
    </>
  );
};

export default ProgramFlow;
