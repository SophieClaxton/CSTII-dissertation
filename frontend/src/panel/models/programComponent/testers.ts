import {
  EditorInnerStep,
  EditorEndStep,
  EditorProgramComponent,
  EditorSection,
  EditorSubsection,
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
): editorProgramComponent is EditorInnerStep => {
  return 'type' in editorProgramComponent;
};

const isEndStep = (
  editorProgramComponent: EditorProgramComponent,
): editorProgramComponent is EditorEndStep => {
  return 'type' in editorProgramComponent;
};

export { isSection, isSubsection, isInnerStep, isEndStep };
