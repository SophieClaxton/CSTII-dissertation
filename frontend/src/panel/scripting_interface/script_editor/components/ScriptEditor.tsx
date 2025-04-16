import { useEffect, useRef, useState } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import './styles/program.css';
import Button from '@mui/material/Button/Button';
import {
  useUnpublishedScriptContext,
  createSyntaxErrorsContext,
  useTabContext,
} from '../../../contexts/contextHooks';
import {
  SyntaxErrorsContext,
  SyntaxErrorsInfo,
} from '../../../contexts/SyntaxErrorsContext';
import { getEdges } from '../flow_utils/getEdges';
import AlertSnackBar from './AlertSnackBar';
import SectionNode from './CST_nodes/SectionNode';
import { addClickedElementListener } from '../../../../messaging/receiveMessage';
import Box from '@mui/material/Box/Box';
import { TabInfo } from '../../../contexts/TabContext';
import UnpublishedScriptDetails from './UnpublishedScriptDetails';
import checkSyntax from '../../syntax_checker/checkSyntax';

const ScriptEditor: React.FC = () => {
  const { unpublishedScript, dispatch } = useUnpublishedScriptContext();
  const { tab } = useTabContext();
  const onTabUpdate = useRef<undefined | ((tab: TabInfo) => void)>(undefined);

  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    error: false,
  });
  const [syntaxErrorsContext, setSyntaxErrorsContext] =
    useState<SyntaxErrorsInfo>({
      errorsMap: new Map(),
      showSyntaxErrors: true,
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

  useEffect(() => {
    const syntaxCheckResult = checkSyntax(unpublishedScript.program);
    setSyntaxErrorsContext((prev) =>
      createSyntaxErrorsContext(syntaxCheckResult, prev.showSyntaxErrors),
    );
  }, [unpublishedScript]);

  return (
    <>
      <UnpublishedScriptDetails
        setSnackBar={setSnackBar}
        setSyntaxErrorsContext={setSyntaxErrorsContext}
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
          style={{
            paddingRight:
              (syntaxErrorsContext?.errorsMap.size ?? 0) > 0 ? '10rem' : '0',
            paddingBottom: '2rem',
          }}
        >
          <Xwrapper>
            <div className="start-block" id="start">
              START
            </div>
            <SyntaxErrorsContext.Provider value={syntaxErrorsContext}>
              {unpublishedScript.program.sections.map((section) => (
                <SectionNode section={section} />
              ))}
            </SyntaxErrorsContext.Provider>
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
        {syntaxErrorsContext.showSyntaxErrors &&
          syntaxErrorsContext.errorsMap.size > 0 && (
            <Button
              variant={'contained'}
              color={'warning'}
              onClick={() =>
                setSyntaxErrorsContext((prev) =>
                  prev
                    ? {
                        ...prev,
                        showSyntaxErrors: false,
                      }
                    : prev,
                )
              }
              sx={{
                position: 'fixed',
                bottom: '2rem',
                width: 'fit-content',
                margin: '1rem',
                alignSelf: 'flex-end',
              }}
            >
              Hide Errors
            </Button>
          )}
        {!syntaxErrorsContext.showSyntaxErrors &&
          syntaxErrorsContext.errorsMap.size > 0 && (
            <Button
              variant={'contained'}
              color={'warning'}
              onClick={() =>
                setSyntaxErrorsContext((prev) =>
                  prev
                    ? {
                        ...prev,
                        showSyntaxErrors: true,
                      }
                    : prev,
                )
              }
              sx={{
                position: 'fixed',
                bottom: '2rem',
                width: 'fit-content',
                margin: '1rem',
                alignSelf: 'flex-end',
              }}
            >
              Show Errors
            </Button>
          )}
        <AlertSnackBar snackBar={snackBar} setSnackBar={setSnackBar} />
      </Box>
    </>
  );
};

export default ScriptEditor;
