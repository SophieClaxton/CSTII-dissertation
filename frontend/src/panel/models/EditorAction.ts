import InterfaceElement from './InterfaceElement';
import {
  CSTEndStepId,
  CSTEndStepNode,
  CSTInnerStepId,
  CSTInnerStepNode,
  CSTSectionId,
  CSTSubsectionId,
  CSTUserDecisionNode,
} from './CST/CST';

enum EditorActionType {
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
  type: EditorActionType;
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
  type: EditorActionType.EditProgramName;
  newName: string;
}

interface EditProgramAuthorAction extends BaseEditorAction {
  type: EditorActionType.EditProgramAuthor;
  newAuthor: string;
}

interface EditInnerStepAction extends BaseEditorAction {
  type: EditorActionType.EditInnerStep;
  stepId: CSTInnerStepId;
  comment?: string;
  element?: InterfaceElement;
}

interface AddInnerStepAction extends BaseEditorAction {
  type: EditorActionType.AddInnerStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  innerStep: CSTInnerStepNode;
}

interface DeleteInnerStepAction extends BaseEditorAction {
  type: EditorActionType.DeleteInnerStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  innerStepId: CSTInnerStepId;
}

interface EditEndStepAction extends BaseEditorAction {
  type: EditorActionType.EditEndStep;
  stepId: CSTEndStepId;
  comment?: string;
  element?: InterfaceElement;
}

interface AddEndStepAction extends BaseEditorAction {
  type: EditorActionType.AddEndStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  endStep: CSTEndStepNode;
}

interface DeleteEndStepAction extends BaseEditorAction {
  type: EditorActionType.DeleteEndStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  endStepId: CSTEndStepId;
}

interface ChangeUserDecisionStepToInnerStepAction extends BaseEditorAction {
  type: EditorActionType.ChangeUserDecisionStepToInnerStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  userDecisionStep: CSTUserDecisionNode;
}

interface ChangeUserDecisionStepToEndStepAction extends BaseEditorAction {
  type: EditorActionType.ChangeUserDecisionStepToEndStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  userDecisionStep: CSTUserDecisionNode;
}

export { EditorActionType };
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
