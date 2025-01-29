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
  SetPublishedScriptId = 'setPublishedScriptId',
  AddSection = 'addSection',
  DeleteSection = 'deleteSection',
  AddStep = 'addStep',
  EditStepElement = 'editStepElement',
  EditInputStepDescription = 'editInputStepDescription',
  DeleteStep = 'deleteStep',
  RearrangeInnerSteps = 'rearrangeInnerSteps',
  EditUserDecisionQuestion = 'editUserDecisionQuestion',
  ChangeUserDecisionStepToInnerStep = 'changeUserDecisionStepToInnerStep',
  ChangeUserDecisionStepToEndStep = 'changeUserDecisionStepToEndStep',
}

interface BaseEditorAction {
  type: EditorActionType;
}

type EditorAction =
  | EditScriptTitleAction
  | EditScriptDescriptionAction
  | SetPublishedScriptIdAction
  | AddSectionAction
  | DeleteSectionAction
  | EditStepElementAction
  | EditInputStepDescription
  | AddStepAction
  | DeleteStepAction
  | RearrangeInnerStepsAction
  | EditUserDecisionQuestion
  | ChangeUserDecisionStepToInnerStepAction
  | ChangeUserDecisionStepToEndStepAction;

interface EditScriptTitleAction extends BaseEditorAction {
  type: EditorActionType.EditScriptTitle;
  title: string;
}

interface EditScriptDescriptionAction extends BaseEditorAction {
  type: EditorActionType.EditScriptDescription;
  description: string;
}

interface SetPublishedScriptIdAction extends BaseEditorAction {
  type: EditorActionType.SetPublishedScriptId;
  id: number | undefined;
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

interface EditInputStepDescription extends BaseEditorAction {
  type: EditorActionType.EditInputStepDescription;
  stepId: CSTStepNode['id'];
  description: string;
  isExact: boolean;
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

interface EditUserDecisionQuestion extends BaseEditorAction {
  type: EditorActionType.EditUserDecisionQuestion;
  stepId: CSTUserDecisionNode['id'];
  question: string;
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
  EditScriptTitleAction,
  EditScriptDescriptionAction,
  SetPublishedScriptIdAction,
  AddSectionAction,
  DeleteSectionAction,
  AddStepAction,
  EditStepElementAction,
  EditInputStepDescription,
  DeleteStepAction,
  RearrangeInnerStepsAction,
  EditUserDecisionQuestion,
  ChangeUserDecisionStepToInnerStepAction,
  ChangeUserDecisionStepToEndStepAction,
};
