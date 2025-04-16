import { TabInfo } from '../panel/contexts/TabContext';
import { ASTInstruction } from '../panel/models/AST/Instruction';
import { CSTStepNodeType } from '../panel/models/CST/CST';
import { isEndStepId, isInnerStepId } from '../panel/models/CST/testers';
import { EditorAction, EditorActionType } from '../panel/models/EditorAction';
import { isSelectableTag } from '../panel/models/interface_element/selectableTag';
import { mapStepNodeToValidTags } from '../panel/models/interface_element/validTags';
import { StateRef } from '../panel/models/utilTypes';
import { mapStringToId } from '../panel/scripting_interface/unpublished_script_reducer/mappers/nodeIds';
import { ContentScriptMessage, UserStruggleData } from './message';

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
