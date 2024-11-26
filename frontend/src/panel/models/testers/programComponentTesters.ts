import { EditorInnerStep, EditorEndStep } from '../ProgramComponent';

const isInnerStep = (editorStep: EditorInnerStep | EditorEndStep): editorStep is EditorInnerStep => {
  return 'type' in editorStep;
};

const isEndStep = (editorStep: EditorInnerStep | EditorEndStep): editorStep is EditorEndStep => {
  return 'type' in editorStep;
};

export { isInnerStep, isEndStep };
