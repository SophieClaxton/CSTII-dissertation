import { EditorAction, EditorActionType } from '../models/EditorAction';
import { UnpublishedScript } from '../models/UnpublishedScript';
import { addInnerStep, addEndStep, rearrangeInnerSteps } from './actions';

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
    case EditorActionType.EditInnerStep: {
      return unpublishedScript;
    }
    case EditorActionType.AddInnerStep:
      return addInnerStep(unpublishedScript, action);
    case EditorActionType.DeleteInnerStep:
      return unpublishedScript;
    case EditorActionType.RearrangeInnerSteps:
      return rearrangeInnerSteps(unpublishedScript, action);
    case EditorActionType.EditEndStep:
      return unpublishedScript;
    case EditorActionType.AddEndStep:
      return addEndStep(unpublishedScript, action);
    case EditorActionType.DeleteEndStep:
      return unpublishedScript;
    case EditorActionType.ChangeUserDecisionStepToInnerStep:
      return unpublishedScript;
    case EditorActionType.ChangeUserDecisionStepToEndStep:
      return unpublishedScript;
  }
};

export { unpublishedScriptReducer };
