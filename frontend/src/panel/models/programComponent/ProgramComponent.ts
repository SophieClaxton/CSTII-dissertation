import InterfaceElement from '../InterfaceElement';

interface EditorProgram {
  name: string;
  author: string;
  dateCreated: string;
  sections: EditorSection[];
}

type EditorProgramComponent =
  | EditorSection
  | EditorSubsection
  | EditorInnerStep
  | EditorEndStep;

interface EditorComponent {
  id: string;
}

interface EditorProgramSection extends EditorComponent {
  innerSteps: EditorInnerStep[];
  endStep?: EditorEndStep;
}

interface EditorSubsection extends EditorProgramSection {
  answer: 'yes' | 'no';
}

interface EditorSection extends EditorProgramSection {
  url: string;
  name?: string;
}

enum EditorStepType {
  Follow = 'Follow',
  Click = 'Click',
  Read = 'Read',
  ScrollTo = 'Scroll-To',
  Drag = 'Drag',
  UserDecision = 'User Decision',
  Write = 'Write',
  Select = 'Select',
  Check = 'Check',
  Draw = 'Draw',
}

type EditorStep = EditorInnerStep | EditorEndStep;

interface BaseEditorStep extends EditorComponent {
  type: EditorStepType;
  element?: InterfaceElement;
}

type EditorInnerStep =
  | EditorClickStep
  | EditorReadStep
  | EditorScrollToStep
  | EditorDragStep
  | EditorUserDecisionStep
  | EditorInputStep;

type EditorEndStep = EditorFollowStep | EditorUserDecisionEndStep;

interface EditorFollowStep extends BaseEditorStep {
  type: EditorStepType.Follow;
  nextSectionId?: string;
  parentSectionId: string;
}

interface EditorClickStep extends BaseEditorStep {
  type: EditorStepType.Click;
}

interface EditorReadStep extends BaseEditorStep {
  type: EditorStepType.Read;
}

interface EditorScrollToStep extends BaseEditorStep {
  type: EditorStepType.ScrollTo;
}

interface EditorDragStep extends BaseEditorStep {
  type: EditorStepType.Drag;
}

enum EditorUserDecisionEndsWithType {
  Follow = 'Folow',
  InnerStep = 'InnerStep',
}

type EditorUserDecisionStep =
  | EditorUserDecisionInnerStep
  | EditorUserDecisionEndStep;

interface BaseEditorUserDecisionStep extends EditorComponent {
  type: EditorStepType.UserDecision;
  question?: string;
  choice1: EditorSubsection;
  choice2: EditorSubsection;
  endsWithFollow: EditorUserDecisionEndsWithType;
}

interface EditorUserDecisionInnerStep extends BaseEditorUserDecisionStep {
  endsWithFollow: EditorUserDecisionEndsWithType.InnerStep;
}

interface EditorUserDecisionEndStep extends BaseEditorUserDecisionStep {
  endsWithFollow: EditorUserDecisionEndsWithType.Follow;
}

type EditorInputStep =
  | EditorWriteStep
  | EditorSelectStep
  | EditorCheckStep
  | EditorDrawStep;

interface EditorInputStepBase extends BaseEditorStep {
  description?: string;
}

interface EditorWriteStep extends EditorInputStepBase {
  type: EditorStepType.Write;
}

interface EditorSelectStep extends EditorInputStepBase {
  type: EditorStepType.Write;
}

interface EditorCheckStep extends EditorInputStepBase {
  type: EditorStepType.Write;
}

interface EditorDrawStep extends EditorInputStepBase {
  type: EditorStepType.Write;
}

export { EditorStepType, EditorUserDecisionEndsWithType };
export type {
  EditorProgram,
  EditorProgramComponent,
  EditorProgramSection,
  EditorSection,
  EditorSubsection,
  EditorStep,
  EditorInnerStep,
  EditorEndStep,
  EditorFollowStep,
  EditorClickStep,
  EditorReadStep,
  EditorScrollToStep,
  EditorDragStep,
  EditorUserDecisionStep,
  EditorUserDecisionInnerStep,
  EditorUserDecisionEndStep,
  EditorWriteStep,
  EditorSelectStep,
  EditorCheckStep,
  EditorDrawStep,
};
