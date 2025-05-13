import { EditorAction, EditorActionType } from '../../models/EditorAction';
import { UnpublishedTaskWorkflow } from '../../models/api/UnpublishedTaskWorkflow';
import { addSection, deleteSection } from './sectionActions';
import {
  editInputStepInputDescription,
  editIsChecked,
  editSelectedOption,
  rearrangeInnerSteps,
} from './innerStepActions';
import { CSTProgram } from '../../models/CST/CST';
import {
  addStep,
  deleteStep,
  editStepElement,
  editUserDecisionQuestion,
} from './stepActions';

const editTaskWorkflowProgram =
  (workflow: UnpublishedTaskWorkflow) =>
  <T extends EditorAction>(
    action: T,
    programChange: (program: CSTProgram, action: T) => CSTProgram,
  ): UnpublishedTaskWorkflow => {
    return { ...workflow, program: programChange(workflow.program, action) };
  };

const unpublishedTaskWorkflowReducer = (
  unpublishedTaskWorkflow: UnpublishedTaskWorkflow,
  action: EditorAction,
): UnpublishedTaskWorkflow => {
  console.log(`Dispatching to editorProgramReducer action:${action.type}`);
  const editProgram = editTaskWorkflowProgram(unpublishedTaskWorkflow);
  switch (action.type) {
    case EditorActionType.EditWorkflowTitle:
      return {
        ...unpublishedTaskWorkflow,
        title: action.title,
      };
    case EditorActionType.EditWorkflowDescription:
      return {
        ...unpublishedTaskWorkflow,
        description: action.description,
      };
    case EditorActionType.SetPublishedWorkflowId:
      return {
        ...unpublishedTaskWorkflow,
        published_script_id: action.id,
      };
    case EditorActionType.AddSection:
      return editProgram(action, addSection);
    case EditorActionType.DeleteSection:
      return editProgram(action, deleteSection);
    case EditorActionType.AddStep:
      return editProgram(action, addStep);
    case EditorActionType.EditStepElement:
      return editProgram(action, editStepElement);
    case EditorActionType.EditInputStepDescription:
      return editProgram(action, editInputStepInputDescription);
    case EditorActionType.EditIsChecked:
      return editProgram(action, editIsChecked);
    case EditorActionType.EditSelectedOption:
      return editProgram(action, editSelectedOption);
    case EditorActionType.DeleteStep:
      return editProgram(action, deleteStep);
    case EditorActionType.RearrangeInnerSteps:
      return editProgram(action, rearrangeInnerSteps);
    case EditorActionType.EditUserDecisionQuestion:
      return editProgram(action, editUserDecisionQuestion);
    case EditorActionType.ChangeUserDecisionStepToInnerStep:
      return unpublishedTaskWorkflow;
    case EditorActionType.ChangeUserDecisionStepToEndStep:
      return unpublishedTaskWorkflow;
    default: {
      const e: never = action;
      return e;
    }
  }
};

export { unpublishedTaskWorkflowReducer };
