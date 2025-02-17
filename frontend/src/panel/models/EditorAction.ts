import InterfaceElement, { Option } from './InterfaceElement';
import {
  CSTEndStepId,
  CSTInnerStepId,
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
  EditIsChecked = 'editIsChecked',
  EditSelectedOption = 'editSelectedOption',
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
  | EditInputStepDescriptionAction
  | EditIsCheckedAction
  | EditSelectedOptionAction
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
}

interface EditInputStepDescriptionAction extends BaseEditorAction {
  type: EditorActionType.EditInputStepDescription;
  stepId: CSTInnerStepId;
  description: string;
  isExact: boolean;
}

interface EditIsCheckedAction extends BaseEditorAction {
  type: EditorActionType.EditIsChecked;
  stepId: CSTInnerStepId;
  isChecked: boolean;
}

interface EditSelectedOptionAction extends BaseEditorAction {
  type: EditorActionType.EditSelectedOption;
  stepId: CSTInnerStepId;
  option: Option;
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
  EditInputStepDescriptionAction,
  EditIsCheckedAction,
  EditSelectedOptionAction,
  DeleteStepAction,
  RearrangeInnerStepsAction,
  EditUserDecisionQuestion,
  ChangeUserDecisionStepToInnerStepAction,
  ChangeUserDecisionStepToEndStepAction,
};
