import { useEffect, useRef, useState } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import './styles/program.css';
import Button from '@mui/material/Button/Button';
import {
  useUnpublishedWorkflowContext,
  createSyntaxErrorsContext,
  useTabContext,
  createAnnotationsContext,
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
import UnpublishedWorkflowDetails from './UnpublishedWorkflowDetails';
import checkSyntax from '../../syntax_checker/checkSyntax';
import {
  AnnotationsContex,
  AnnotationsContextInfo,
} from '../../../contexts/AnnotationsContext';
import Stack from '@mui/material/Stack/Stack';

const DSVPLEditor: React.FC = () => {
  const { unpublishedWorkflow, dispatch } = useUnpublishedWorkflowContext();
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
  const [annotationsContext, setAnnotationsContext] =
    useState<AnnotationsContextInfo>(
      createAnnotationsContext(
        unpublishedWorkflow.annotations,
        unpublishedWorkflow.program,
        true,
      ),
    );

  const edges = getEdges(unpublishedWorkflow.program.sections);
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
    const syntaxCheckResult = checkSyntax(unpublishedWorkflow.program);
    setSyntaxErrorsContext((prev) =>
      createSyntaxErrorsContext(syntaxCheckResult, prev.showSyntaxErrors),
    );
  }, [unpublishedWorkflow]);

  return (
    <>
      <UnpublishedWorkflowDetails
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
            paddingRight: ~(
              syntaxErrorsContext.showSyntaxErrors ||
              annotationsContext.showAnnotations
            )
              ? '12rem'
              : '0',
          }}
        >
          <Xwrapper>
            <div className="start-block" id="start">
              START
            </div>
            <AnnotationsContex.Provider value={annotationsContext}>
              <SyntaxErrorsContext.Provider value={syntaxErrorsContext}>
                {unpublishedWorkflow.program.sections.map((section) => (
                  <SectionNode section={section} />
                ))}
              </SyntaxErrorsContext.Provider>
            </AnnotationsContex.Provider>
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
      <Stack
        direction="row"
        sx={{
          gap: '0.25rem',
          width: '100%',
          padding: '0.25rem 0.5rem',
          justifyContent: 'end',
          zIndex: 10,
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px -6px 5px 0px',
        }}
      >
        {syntaxErrorsContext.errorsMap.size > 0 && (
          <Button
            variant={'contained'}
            color={'error'}
            onClick={() =>
              setSyntaxErrorsContext((prev) =>
                prev
                  ? {
                      ...prev,
                      showSyntaxErrors: !syntaxErrorsContext.showSyntaxErrors,
                    }
                  : prev,
              )
            }
          >
            {syntaxErrorsContext.showSyntaxErrors ? 'Hide' : 'Show'} Errors
          </Button>
        )}
        {annotationsContext.annotationsMap.size > 0 && (
          <Button
            variant={'contained'}
            color={'info'}
            onClick={() =>
              setAnnotationsContext((prev) => ({
                ...prev,
                showAnnotations: !annotationsContext.showAnnotations,
              }))
            }
          >
            {annotationsContext.showAnnotations ? 'Hide' : 'Show'} Annotations
          </Button>
        )}
      </Stack>
    </>
  );
};

export default DSVPLEditor;
