import {
  EditorProgramComponent,
  EditorSection,
  EditorSubsection,
  EditorStepType,
  EditorUserDecisionEndsWithType,
} from './ProgramComponent';

const isSection = (
  editorProgramComponent: EditorProgramComponent,
): editorProgramComponent is EditorSection => {
  return 'id' in editorProgramComponent;
};

const isSubsection = (
  editorProgramComponent: EditorProgramComponent,
): editorProgramComponent is EditorSubsection => {
  return 'id' in editorProgramComponent;
};

const isInnerStep = (
  editorProgramComponent: EditorProgramComponent,
): boolean => {
  if (!('type' in editorProgramComponent)) {
    return false;
  }
  const innerStepTypes = [
    EditorStepType.Click,
    EditorStepType.Read,
    EditorStepType.ScrollTo,
    EditorStepType.Drag,
    EditorStepType.Write,
    EditorStepType.Select,
    EditorStepType.Check,
    EditorStepType.Draw,
  ];
  return (
    innerStepTypes.includes(editorProgramComponent.type) ||
    (editorProgramComponent.type === EditorStepType.UserDecision &&
      editorProgramComponent.endsWithFollow ===
        EditorUserDecisionEndsWithType.InnerStep)
  );
};

const isEndStep = (editorProgramComponent: EditorProgramComponent): boolean => {
  if (!('type' in editorProgramComponent)) {
    return false;
  }
  return (
    editorProgramComponent.type === EditorStepType.Follow ||
    (editorProgramComponent.type === EditorStepType.UserDecision &&
      editorProgramComponent.endsWithFollow ===
        EditorUserDecisionEndsWithType.Follow)
  );
};

export { isSection, isSubsection, isInnerStep, isEndStep };
