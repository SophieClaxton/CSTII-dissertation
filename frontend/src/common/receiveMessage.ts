import { isEndStepId, isInnerStepId } from '../panel/models/CST/testers';
import { EditorAction, EditorActionType } from '../panel/models/EditorAction';
import { isSelectableTag } from '../panel/models/InterfaceElement';
import { mapStringToId } from '../panel/unpublishedScriptReducer/mappers/nodeIds';
import { ContentScriptMessage } from './message';

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

const addUserStruggleDataListener = () => {
  chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
    if (message.type === 'user_struggle_data') {
      console.log('received user struggle data');
      console.log(message.userStruggleData);
    }
  });
};

const addStepCompletedListener = (
  updateCurrentStep: (nextStepIndex: number) => void,
) => {
  chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
    if (message.type === 'step_completed') {
      console.log('Received step completed message');
      updateCurrentStep(message.index);
    }
  });
};

export {
  addClickedElementListener,
  addUserStruggleDataListener,
  addStepCompletedListener,
};
