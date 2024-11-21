import InterfaceElement from './InterfaceElement';
import {
  EditorEndStep,
  EditorInnerStep,
  EditorUserDecisionStep,
} from './programComponent/ProgramComponent';

enum EditorReducerActionType {
  EditProgramName = 'editProgramName',
  EditProgramAuthor = 'editProgramAuthor',
  EditInnerStep = 'editInnerStep',
  AddInnerStep = 'addInnerStep',
  DeleteInnerStep = 'deleteInnerStep',
  EditEndStep = 'editEndStep',
  AddEndStep = 'addEndStep',
  DeleteEndStep = 'deleteEndStep',
  ChangeUserDecisionStepToInnerStep = 'changeUserDecisionStepToInnerStep',
  ChangeUserDecisionStepToEndStep = 'changeUserDecisionStepToEndStep',
}

interface BaseEditorAction {
  type: EditorReducerActionType;
}

type EditorAction =
  | EditProgramNameAction
  | EditProgramAuthorAction
  | EditInnerStepAction
  | AddInnerStepAction
  | DeleteInnerStepAction
  | EditEndStepAction
  | AddEndStepAction
  | DeleteEndStepAction
  | ChangeUserDecisionStepToInnerStepAction
  | ChangeUserDecisionStepToEndStepAction;

interface EditProgramNameAction extends BaseEditorAction {
  type: EditorReducerActionType.EditProgramName;
  newName: string;
}

interface EditProgramAuthorAction extends BaseEditorAction {
  type: EditorReducerActionType.EditProgramAuthor;
  newAuthor: string;
}

interface EditInnerStepAction extends BaseEditorAction {
  type: EditorReducerActionType.EditInnerStep;
  stepId: string;
  comment?: string;
  element?: InterfaceElement;
}

interface AddInnerStepAction extends BaseEditorAction {
  type: EditorReducerActionType.AddInnerStep;
  sectionId: string;
  innerStep: EditorInnerStep;
}

interface DeleteInnerStepAction extends BaseEditorAction {
  type: EditorReducerActionType.DeleteInnerStep;
  sectionId: string;
  innerStepId: string;
}

interface EditEndStepAction extends BaseEditorAction {
  type: EditorReducerActionType.EditEndStep;
  stepId: string;
  comment?: string;
  element?: InterfaceElement;
}

interface AddEndStepAction extends BaseEditorAction {
  type: EditorReducerActionType.AddEndStep;
  sectionId: string;
  endStep: EditorEndStep;
}

interface DeleteEndStepAction extends BaseEditorAction {
  type: EditorReducerActionType.DeleteEndStep;
  sectionId: string;
  endStepId: string;
}

interface ChangeUserDecisionStepToInnerStepAction extends BaseEditorAction {
  type: EditorReducerActionType.ChangeUserDecisionStepToInnerStep;
  sectionId: string;
  userDecisionStep: EditorUserDecisionStep;
}

interface ChangeUserDecisionStepToEndStepAction extends BaseEditorAction {
  type: EditorReducerActionType.ChangeUserDecisionStepToEndStep;
  sectionId: string;
  userDecisionStep: EditorUserDecisionStep;
}

export { EditorReducerActionType };
export type {
  EditorAction,
  EditProgramNameAction,
  EditProgramAuthorAction,
  EditInnerStepAction,
  AddInnerStepAction,
  DeleteInnerStepAction,
  EditEndStepAction,
  AddEndStepAction,
  DeleteEndStepAction,
  ChangeUserDecisionStepToInnerStepAction,
  ChangeUserDecisionStepToEndStepAction,
};
