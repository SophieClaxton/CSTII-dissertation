import { EditorAction, EditorActionType } from '../models/EditorAction';
import { UnpublishedScript } from '../models/API/UnpublishedScript';
import { addSection, deleteSection } from './sectionActions';
import {
  editEndStepElement,
  addEndStep,
  deleteEndStep,
} from './endStepActions';
import {
  editInnerStepElement,
  addInnerStep,
  deleteInnerStep,
  rearrangeInnerSteps,
} from './innerStepActions';

const unpublishedScriptReducer = (
  unpublishedScript: UnpublishedScript,
  action: EditorAction,
): UnpublishedScript => {
  console.log(`Dispatching to editorProgramReducer action:${action.type}`);
  switch (action.type) {
    case EditorActionType.EditProgramName:
      return {
        ...unpublishedScript,
        title: action.newName,
      };
    case EditorActionType.EditProgramAuthor:
      return {
        ...unpublishedScript,
        author: { ...unpublishedScript.author, name: action.newAuthor },
      };
    case EditorActionType.AddSection:
      return addSection(unpublishedScript, action);
    case EditorActionType.DeleteSection:
      return deleteSection(unpublishedScript, action);
    case EditorActionType.EditInnerStepElement:
      return editInnerStepElement(unpublishedScript, action);
    case EditorActionType.AddInnerStep:
      return addInnerStep(unpublishedScript, action);
    case EditorActionType.DeleteInnerStep:
      return deleteInnerStep(unpublishedScript, action);
    case EditorActionType.RearrangeInnerSteps:
      return rearrangeInnerSteps(unpublishedScript, action);
    case EditorActionType.EditEndStepElement:
      return editEndStepElement(unpublishedScript, action);
    case EditorActionType.AddEndStep:
      return addEndStep(unpublishedScript, action);
    case EditorActionType.DeleteEndStep:
      return deleteEndStep(unpublishedScript, action);
    case EditorActionType.ChangeUserDecisionStepToInnerStep:
      return unpublishedScript;
    case EditorActionType.ChangeUserDecisionStepToEndStep:
      return unpublishedScript;
  }
};

export { unpublishedScriptReducer };
