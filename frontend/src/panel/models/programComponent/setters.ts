import { EditorAction, EditorReducerActionType } from '../EditorReducerActions';
import {
  EditorSection,
  EditorStep,
  EditorSubsection,
} from './ProgramComponent';
import { isInnerStep } from './testers';

const addEditorStepToSection = (
  programDispatch: React.Dispatch<EditorAction>,
  section: EditorSection | EditorSubsection,
  step: EditorStep,
) => {
  if (isInnerStep(step)) {
    programDispatch({
      type: EditorReducerActionType.AddInnerStep,
      sectionId: section.id,
      innerStep: step,
    });
  }
  // if (isEndStep(step) && !section.endStep) {
  //   programDispatch({ type: EditorReducerActionType.AddEndStep, sectionId: section.id, endStep: step });
  // }
};

export { addEditorStepToSection };
