import { EditorAction, EditorActionType } from '../models/EditorAction';
import { UnpublishedScript } from '../models/API/UnpublishedScript';
import { addSection, deleteSection } from './sectionActions';
import {
  editInputStepInputDescription,
  editIsChecked,
  editSelectedOption,
  rearrangeInnerSteps,
} from './innerStepActions';
import { CSTProgram } from '../models/CST/CST';
import {
  addStep,
  deleteStep,
  editStepElement,
  editUserDecisionQuestion,
} from './stepActions';

const editScriptProgram =
  (script: UnpublishedScript) =>
  <T extends EditorAction>(
    action: T,
    programChange: (program: CSTProgram, action: T) => CSTProgram,
  ): UnpublishedScript => {
    return { ...script, program: programChange(script.program, action) };
  };

const unpublishedScriptReducer = (
  unpublishedScript: UnpublishedScript,
  action: EditorAction,
): UnpublishedScript => {
  console.log(`Dispatching to editorProgramReducer action:${action.type}`);
  const editProgram = editScriptProgram(unpublishedScript);
  switch (action.type) {
    case EditorActionType.EditScriptTitle:
      return {
        ...unpublishedScript,
        title: action.title,
      };
    case EditorActionType.EditScriptDescription:
      return {
        ...unpublishedScript,
        description: action.description,
      };
    case EditorActionType.SetPublishedScriptId:
      return {
        ...unpublishedScript,
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
      return unpublishedScript;
    case EditorActionType.ChangeUserDecisionStepToEndStep:
      return unpublishedScript;
    default: {
      const e: never = action;
      return e;
    }
  }
};

export { unpublishedScriptReducer };
