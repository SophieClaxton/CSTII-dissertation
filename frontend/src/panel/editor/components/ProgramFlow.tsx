import { useCallback, useEffect, useState } from 'react';
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
import { Message } from '../../../common/message';
import { isEndStepId, isInnerStepId } from '../../models/CST/testers';
import { EditorActionType } from '../../models/EditorAction';
import { isSelectableTag } from '../../models/InterfaceElement';
import { mapStringToId } from '../../unpublishedScriptReducer/mappers/nodeIds';
import { publishScript } from '../../api/scripts';

const ProgramFlow: React.FC = () => {
  const { unpublishedScript, dispatch } = useUnpublishedScriptContext();
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

  const addMessageListener = useCallback(() => {
    chrome.runtime.onMessage.addListener(async (message: Message) => {
      if (message.type === 'clicked_element') {
        const stepId = mapStringToId(message.stepId);
        if (
          !isSelectableTag(message.elementTag) ||
          !(isEndStepId(stepId) || isInnerStepId(stepId))
        ) {
          throw Error('Received an invalid element tag or invalid stepId');
        }
        const receivedElement = {
          outerHTML: message.elementOuterHtml,
          tag: message.elementTag,
          textContent: message.elementTextContent ?? undefined,
          url: message.url,
        };
        // console.log(receivedElement);
        dispatch({
          type: EditorActionType.EditStepElement,
          stepId: stepId,
          element: receivedElement,
          oldUrl: message.url,
        });

        if (isEndStepId(stepId) && message.elementTag === 'A') {
          dispatch({
            type: EditorActionType.AddSection,
            sectionUrl: message.newUrl,
            followStepId: stepId,
          });
        }
      }
    });
  }, [dispatch]);

  useEffect(addMessageListener, [addMessageListener]);

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
            console.log(typeCheckResult);
            if (typeCheckResult.success === false) {
              setTypeErrors(typeCheckResult.errors);
            } else {
              const publish = async () => {
                const response = await publishScript({
                  title: unpublishedScript.title,
                  author_id: unpublishedScript.author.id,
                  created_at: unpublishedScript.created_at,
                  description: '',
                  program: typeCheckResult.program,
                  website_id: 1,
                });
                if (response.status === 'Loaded') {
                  setSnackBar({
                    open: true,
                    message: 'Script Published',
                    error: false,
                  });
                } else {
                  setSnackBar({
                    open: true,
                    message: 'Failed to publish script',
                    error: true,
                  });
                }
              };
              publish();
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
