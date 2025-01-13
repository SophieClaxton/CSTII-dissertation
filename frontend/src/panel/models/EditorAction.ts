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
  EditScriptTitle = 'editScriptTitle',
  EditScriptDescription = 'editScriptDescription',
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
  | EditScriptTitle
  | EditScriptDescription
  | AddSectionAction
  | DeleteSectionAction
  | EditStepElementAction
  | AddStepAction
  | DeleteStepAction
  | RearrangeInnerStepsAction
  | ChangeUserDecisionStepToInnerStepAction
  | ChangeUserDecisionStepToEndStepAction;

interface EditScriptTitle extends BaseEditorAction {
  type: EditorActionType.EditScriptTitle;
  title: string;
}

interface EditScriptDescription extends BaseEditorAction {
  type: EditorActionType.EditScriptDescription;
  description: string;
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
  EditScriptTitle,
  EditScriptDescription,
  AddSectionAction,
  DeleteSectionAction,
  AddStepAction,
  EditStepElementAction,
  DeleteStepAction,
  RearrangeInnerStepsAction,
  ChangeUserDecisionStepToInnerStepAction,
  ChangeUserDecisionStepToEndStepAction,
};
