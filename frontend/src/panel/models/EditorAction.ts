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
  EditInnerStepElement = 'editInnerStepElement',
  AddSection = 'addSection',
  DeleteSection = 'deleteSection',
  AddInnerStep = 'addInnerStep',
  DeleteInnerStep = 'deleteInnerStep',
  RearrangeInnerSteps = 'rearrangeInnerSteps',
  EditEndStepElement = 'editEndStepElement',
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
  | AddSectionAction
  | DeleteSectionAction
  | EditInnerStepElementAction
  | AddInnerStepAction
  | DeleteInnerStepAction
  | RearrangeInnerStepsAction
  | EditEndStepElementAction
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

interface AddSectionAction extends BaseEditorAction {
  type: EditorActionType.AddSection;
  sectionUrl: string;
  followStepId: CSTEndStepId;
}

interface DeleteSectionAction extends BaseEditorAction {
  type: EditorActionType.DeleteSection;
  sectionId: CSTSectionId;
}

interface EditInnerStepElementAction extends BaseEditorAction {
  type: EditorActionType.EditInnerStepElement;
  stepId: CSTInnerStepId;
  element: InterfaceElement | undefined;
  oldUrl: string;
}

interface AddInnerStepAction extends BaseEditorAction {
  type: EditorActionType.AddInnerStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  innerStep: CSTInnerStepNode;
}

interface DeleteInnerStepAction extends BaseEditorAction {
  type: EditorActionType.DeleteInnerStep;
  innerStepId: CSTInnerStepId;
}

interface RearrangeInnerStepsAction extends BaseEditorAction {
  type: EditorActionType.RearrangeInnerSteps;
  sectionId: CSTSectionId | CSTSubsectionId;
  innerSteps: CSTInnerStepNode[];
}

interface EditEndStepElementAction extends BaseEditorAction {
  type: EditorActionType.EditEndStepElement;
  stepId: CSTEndStepId;
  element: InterfaceElement | undefined;
  oldUrl: string;
}

interface AddEndStepAction extends BaseEditorAction {
  type: EditorActionType.AddEndStep;
  sectionId: CSTSectionId | CSTSubsectionId;
  endStep: CSTEndStepNode;
}

interface DeleteEndStepAction extends BaseEditorAction {
  type: EditorActionType.DeleteEndStep;
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
  AddSectionAction,
  DeleteSectionAction,
  EditInnerStepElementAction,
  AddInnerStepAction,
  DeleteInnerStepAction,
  RearrangeInnerStepsAction,
  EditEndStepElementAction,
  AddEndStepAction,
  DeleteEndStepAction,
  ChangeUserDecisionStepToInnerStepAction,
  ChangeUserDecisionStepToEndStepAction,
};
