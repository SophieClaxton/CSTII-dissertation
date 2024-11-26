import InterfaceElement from '../InterfaceElement';

interface EditorProgram {
  name: string;
  author: string;
  dateCreated: string;
  sections: EditorSection[];
}

type EditorProgramComponent = EditorSection | EditorSubsection | EditorInnerStep | EditorEndStep;

interface EditorComponent {
  id: string;
}

interface EditorSubsection extends EditorComponent {
  answer: 'yes' | 'no';
  innerSteps: EditorInnerStep[];
  endStep: EditorEndStep | undefined;
}

interface EditorSection extends EditorComponent {
  url: string;
  name?: string;
  innerSteps: EditorInnerStep[];
  endStep: EditorEndStep | undefined;
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

interface EditorStep extends EditorComponent {
  type: EditorStepType;
  element?: InterfaceElement | undefined;
}

type EditorInnerStep =
  | EditorClickStep
  | EditorReadStep
  | EditorScrollToStep
  | EditorDragStep
  | EditorUserDecisionStep
  | EditorInputStep;

type EditorEndStep = EditorFollowStep | EditorUserDecisionEndStep;

interface EditorFollowStep extends EditorStep {
  type: EditorStepType.Follow;
  nextSectionId: string;
  parentSectionId: string;
}

interface EditorClickStep extends EditorStep {
  type: EditorStepType.Click;
}

interface EditorReadStep extends EditorStep {
  type: EditorStepType.Read;
}

interface EditorScrollToStep extends EditorStep {
  type: EditorStepType.Read;
}

interface EditorDragStep extends EditorStep {
  type: EditorStepType.Drag;
}

enum EditorUserDecisionEndsWithType {
  Follow = 'Folow',
  InnerStep = 'InnerStep',
}

type EditorUserDecisionStep = EditorUserDecisionInnerStep | EditorUserDecisionEndStep;

interface BaseEditorUserDecisionStep {
  id: number;
  type: EditorStepType.UserDecision;
  question: string | undefined;
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

type EditorInputStep = EditorWriteStep | EditorSelectStep | EditorCheckStep | EditorDrawStep;

interface EditorInputStepBase extends EditorStep {
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
  EditorSection,
  EditorSubsection,
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
