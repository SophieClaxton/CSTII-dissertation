import { useEffect, useRef, useState } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import './styles/program.css';
import Button from '@mui/material/Button/Button';
import {
  useUnpublishedScriptContext,
  createTypeErrorsContext,
  useTabContext,
} from '../../../contexts/contextHooks';
import { TypeErrorsContext } from '../../../contexts/TypeErrorsContext';
import { TypeCheckError } from '../../../models/CST/typeCheck';
import { getEdges } from '../flow_utils/getEdges';
import AlertSnackBar from './AlertSnackBar';
import SectionNode from './CST_nodes/SectionNode';
import { addClickedElementListener } from '../../../../messaging/receiveMessage';
import Box from '@mui/material/Box/Box';
import { TabInfo } from '../../../contexts/TabContext';
import UnpublishedScriptDetails from './UnpublishedScriptDetails';

const ScriptEditor: React.FC = () => {
  const { unpublishedScript, dispatch } = useUnpublishedScriptContext();
  const { tab } = useTabContext();
  const onTabUpdate = useRef<undefined | ((tab: TabInfo) => void)>(undefined);

  const [typeErrors, setTypeErrors] = useState<TypeCheckError[]>([]);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    error: false,
  });

  const edges = getEdges(unpublishedScript.program.sections);
  console.log(edges);

  const updateArrows = useXarrow();

  useEffect(() => addClickedElementListener(dispatch, onTabUpdate), [dispatch]);
  useEffect(() => {
    if (onTabUpdate.current && tab.status == 'complete') {
      onTabUpdate.current(tab);
      onTabUpdate.current = undefined;
    }
  }, [tab]);

  return (
    <>
      <UnpublishedScriptDetails
        setSnackBar={setSnackBar}
        setTypeErrors={setTypeErrors}
      />
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
        {typeErrors.length > 0 && (
          <Button
            variant={'contained'}
            color={'warning'}
            onClick={() => setTypeErrors([])}
            sx={{
              width: 'fit-content',
              margin: '1rem',
              alignSelf: 'flex-end',
            }}
          >
            Hide Errors
          </Button>
        )}
        <AlertSnackBar snackBar={snackBar} setSnackBar={setSnackBar} />
      </Box>
    </>
  );
};

export default ScriptEditor;
