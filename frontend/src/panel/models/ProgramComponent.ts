import InterfaceElement from './InterfaceElement';

interface EditorProgram {
  name: string;
  author: string;
  dateCreated: string;
  sections: EditorSection[];
}

interface EditorSubsection {
  id: number;
  answer: 'yes' | 'no';
  innerSteps: EditorInnerStep[];
  endStep: EditorFollowStep | undefined;
}

interface EditorSection {
  id: number;
  url: string;
  name?: string;
  innerSteps: EditorInnerStep[];
  endStep: EditorFollowStep | undefined;
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

interface EditorStep {
  type: EditorStepType;
  element: InterfaceElement | undefined;
}

type EditorInnerStep =
  | EditorClickStep
  | EditorReadStep
  | EditorScrollToStep
  | EditorDragStep
  | EditorUserDecisionStep
  | EditorInputStep;

interface EditorFollowStep extends EditorStep {
  type: EditorStepType.Follow;
  nextSectionId: number;
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

interface EditorUserDecisionStep {
  type: EditorStepType.UserDecision;
  question: string | undefined;
  choice1: EditorSubsection;
  choice2: EditorSubsection;
}

type EditorInputStep = EditorWriteStep | EditorSelectStep | EditorCheckStep | EditorDrawStep;

interface EditorInputStepBase {
  type: EditorStepType;
  element: InterfaceElement;
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

interface EditorDrawStep {
  type: EditorStepType.Write;
  element: InterfaceElement;
  description: string;
}

export { EditorStepType };
export type {
  EditorProgram,
  EditorSection,
  EditorSubsection,
  EditorInnerStep,
  EditorFollowStep,
  EditorClickStep,
  EditorReadStep,
  EditorScrollToStep,
  EditorDragStep,
  EditorUserDecisionStep,
  EditorWriteStep,
  EditorSelectStep,
  EditorCheckStep,
  EditorDrawStep,
};
