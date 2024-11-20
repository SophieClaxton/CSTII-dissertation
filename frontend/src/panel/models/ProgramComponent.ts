import InterfaceElement from './InterfaceElement';

interface EditorProgram {
  name: string;
  author: string;
  dateCreated: string;
  sections: EditorSection[];
}

interface EditorSubsection {
  id: number;
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

enum EditorStepName {
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
  name: EditorStepName;
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
  name: EditorStepName.Follow;
  nextSectionId: number;
}

interface EditorClickStep extends EditorStep {
  name: EditorStepName.Click;
}

interface EditorReadStep extends EditorStep {
  name: EditorStepName.Read;
}

interface EditorScrollToStep extends EditorStep {
  name: EditorStepName.Read;
}

interface EditorDragStep extends EditorStep {
  name: EditorStepName.Drag;
}

interface EditorUserDecisionStep {
  name: EditorStepName.UserDecision;
  question: string | undefined;
  choice1: EditorSubsection;
  choice2: EditorSubsection;
}

type EditorInputStep = EditorWriteStep | EditorSelectStep | EditorCheckStep | EditorDrawStep;

interface EditorInputStepBase {
  element: InterfaceElement;
  description?: string;
}

interface EditorWriteStep extends EditorInputStepBase {
  name: EditorStepName.Write;
}

interface EditorSelectStep extends EditorInputStepBase {
  name: EditorStepName.Write;
}

interface EditorCheckStep extends EditorInputStepBase {
  name: EditorStepName.Write;
}

interface EditorDrawStep {
  name: EditorStepName.Write;
  element: InterfaceElement;
  description: string;
}

export { EditorStepName };
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
