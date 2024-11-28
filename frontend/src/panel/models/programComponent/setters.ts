import { EditorAction, EditorReducerActionType } from '../EditorReducerActions';
import {
  EditorEndStep,
  EditorInnerStep,
  EditorSection,
  EditorStep,
  EditorSubsection,
} from './ProgramComponent';
import { isEndStep, isInnerStep } from './testers';

const addEditorStepToSection = (
  programDispatch: React.Dispatch<EditorAction>,
  section: EditorSection | EditorSubsection,
  step: EditorStep,
) => {
  if (isInnerStep(step)) {
    console.log('The following step is an inner step');
    console.log(step);
    return programDispatch({
      type: EditorReducerActionType.AddInnerStep,
      sectionId: section.id,
      innerStep: step as EditorInnerStep,
    });
  }
  if (isEndStep(step) && !section.endStep) {
    console.log('The following step is an end step');
    console.log(step);
    return programDispatch({
      type: EditorReducerActionType.AddEndStep,
      sectionId: section.id,
      endStep: step as EditorEndStep,
    });
  }
};

export { addEditorStepToSection };
