import { isEndStepId, isInnerStepId } from '../panel/models/CST/testers';
import { EditorAction, EditorActionType } from '../panel/models/EditorAction';
import { isSelectableTag } from '../panel/models/InterfaceElement';
import { mapStringToId } from '../panel/unpublishedScriptReducer/mappers/nodeIds';
import { Message } from './message';

const clickedElementListener = (dispatch: React.Dispatch<EditorAction>) => {
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
};

export { clickedElementListener };
