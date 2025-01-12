import InterfaceElement from './InterfaceElement';
import {
  CSTEndStepId,
  CSTInnerStepNode,
  CSTSection,
  CSTSectionId,
  CSTStepNode,
  CSTUserDecisionNode,
} from './CST/CST';

enum EditorActionType {
  EditProgramName = 'editProgramName',
  AddSection = 'addSection',
  DeleteSection = 'deleteSection',
  AddStep = 'addStep',
  EditStepElement = 'editStepElement',
  DeleteStep = 'deleteStep',
  RearrangeInnerSteps = 'rearrangeInnerSteps',
  ChangeUserDecisionStepToInnerStep = 'changeUserDecisionStepToInnerStep',
  ChangeUserDecisionStepToEndStep = 'changeUserDecisionStepToEndStep',
}

interface BaseEditorAction {
  type: EditorActionType;
}

type EditorAction =
  | EditProgramNameAction
  | AddSectionAction
  | DeleteSectionAction
  | EditStepElementAction
  | AddStepAction
  | DeleteStepAction
  | RearrangeInnerStepsAction
  | ChangeUserDecisionStepToInnerStepAction
  | ChangeUserDecisionStepToEndStepAction;

interface EditProgramNameAction extends BaseEditorAction {
  type: EditorActionType.EditProgramName;
  newName: string;
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

interface EditStepElementAction extends BaseEditorAction {
  type: EditorActionType.EditStepElement;
  stepId: CSTStepNode['id'];
  element: InterfaceElement | undefined;
  oldUrl: string;
}

interface AddStepAction extends BaseEditorAction {
  type: EditorActionType.AddStep;
  step: CSTStepNode;
}

interface DeleteStepAction extends BaseEditorAction {
  type: EditorActionType.DeleteStep;
  stepId: CSTStepNode['id'];
}

interface RearrangeInnerStepsAction extends BaseEditorAction {
  type: EditorActionType.RearrangeInnerSteps;
  sectionId: CSTSection['id'];
  innerSteps: CSTInnerStepNode[];
}

interface ChangeUserDecisionStepToInnerStepAction extends BaseEditorAction {
  type: EditorActionType.ChangeUserDecisionStepToInnerStep;
  sectionId: CSTSection['id'];
  userDecisionStep: CSTUserDecisionNode;
}

interface ChangeUserDecisionStepToEndStepAction extends BaseEditorAction {
  type: EditorActionType.ChangeUserDecisionStepToEndStep;
  sectionId: CSTSection['id'];
  userDecisionStep: CSTUserDecisionNode;
}

export { EditorActionType };
export type {
  EditorAction,
  EditProgramNameAction,
  AddSectionAction,
  DeleteSectionAction,
  AddStepAction,
  EditStepElementAction,
  DeleteStepAction,
  RearrangeInnerStepsAction,
  ChangeUserDecisionStepToInnerStepAction,
  ChangeUserDecisionStepToEndStepAction,
};
