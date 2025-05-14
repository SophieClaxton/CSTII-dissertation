import { TabInfo } from '../side_panel/contexts/TabContext';
import { ASTInstruction } from '../side_panel/models/AST/Instruction';
import { CSTStepNodeType } from '../side_panel/models/CST/CST';
import { isEndStepId, isInnerStepId } from '../side_panel/models/CST/testers';
import {
  EditorAction,
  EditorActionType,
} from '../side_panel/models/EditorAction';
import { isSelectableTag } from '../side_panel/models/interface_element/selectableTag';
import { mapStepNodeToValidTags } from '../side_panel/models/interface_element/validTags';
import { InteractionData } from '../side_panel/models/support_and_MII/UserSupport';
import { StateRef } from '../side_panel/models/utilTypes';
import { mapStringToId } from '../side_panel/task_workflows/unpublished_task_workflow_reducer/mappers/nodeIds';
import { ContentScriptMessage } from './message';

const addClickedElementListener = (
  dispatch: React.Dispatch<EditorAction>,
  onTabUpdateRef: StateRef<undefined | ((tab: TabInfo) => void)>,
) => {
  chrome.runtime.onMessage.addListener(
    async (message: ContentScriptMessage) => {
      if (message.type === 'user_clicked_element') {
        const stepId = mapStringToId(message.stepId);
        if (
          !isSelectableTag(message.element.tag) ||
          !(isEndStepId(stepId) || isInnerStepId(stepId))
        ) {
          throw Error('Received an invalid element tag or invalid stepId');
        }
        const receivedElement = message.element;
        console.log(receivedElement);
        dispatch({
          type: EditorActionType.EditStepElement,
          stepId: stepId,
          element: receivedElement,
        });

        if (
          isEndStepId(stepId) &&
          mapStepNodeToValidTags[CSTStepNodeType.Follow]
            .map(({ tag }) => tag)
            .includes(message.element.tag)
        ) {
          console.log(message);
          onTabUpdateRef.current = (tab: TabInfo) =>
            dispatch({
              type: EditorActionType.AddSection,
              sectionUrl: tab.url,
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
  setUserStruggleData: (data: InteractionData) => void,
) => {
  chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
    if (message.type === 'interaction_data') {
      console.log('received interaction data');
      setUserStruggleData(message.interactionData);
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
