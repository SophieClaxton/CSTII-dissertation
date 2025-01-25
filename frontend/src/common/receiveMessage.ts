import { ASTInstruction } from '../panel/models/AST/Instruction';
import { isEndStepId, isInnerStepId } from '../panel/models/CST/testers';
import { EditorAction, EditorActionType } from '../panel/models/EditorAction';
import { isSelectableTag } from '../panel/models/InterfaceElement';
import { mapStringToId } from '../panel/unpublishedScriptReducer/mappers/nodeIds';
import { ContentScriptMessage, UserStruggleData } from './message';

const addClickedElementListener = (dispatch: React.Dispatch<EditorAction>) => {
  chrome.runtime.onMessage.addListener(
    async (message: ContentScriptMessage) => {
      if (message.type === 'user_clicked_element') {
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
    },
  );
};

/** Every time the user struggle data is received, run the Mixed-Initiative Model
 */
const addUserStruggleDataListener = (
  setUserStruggleData: (data: UserStruggleData) => void,
) => {
  chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
    if (message.type === 'user_struggle_data') {
      console.log('received user struggle data');
      setUserStruggleData(message.userStruggleData);
    }
  });
};

const addStepCompletedListener = (
  setStepCompleted: (step: ASTInstruction) => void,
) => {
  chrome.runtime.onMessage.addListener(
    async (message: ContentScriptMessage) => {
      if (message.type === 'step_completed') {
        console.log(
          `received step ${message.step.stepNumber} completed message`,
        );
        setStepCompleted(message.step);
      }
    },
  );
};

export {
  addClickedElementListener,
  addUserStruggleDataListener,
  addStepCompletedListener,
};
