import { EditorAction, EditorActionType } from '../EditorAction';
import {
  CSTEndStepNode,
  CSTInnerStepNode,
  CSTSectionNode,
  CSTStepNode,
  CSTSubsectionNode,
} from './CST';
import { isEndStep, isInnerStep } from './testers';

const addEditorStepToSection = (
  programDispatch: React.Dispatch<EditorAction>,
  section: CSTSectionNode | CSTSubsectionNode,
  step: CSTStepNode,
) => {
  if (isInnerStep(step)) {
    console.log('The following step is an inner step');
    console.log(step);
    return programDispatch({
      type: EditorActionType.AddInnerStep,
      sectionId: section.id,
      innerStep: step as CSTInnerStepNode,
    });
  }
  if (isEndStep(step) && !section.endStep) {
    console.log('The following step is an end step');
    console.log(step);
    return programDispatch({
      type: EditorActionType.AddEndStep,
      sectionId: section.id,
      endStep: step as CSTEndStepNode,
    });
  }
};

export { addEditorStepToSection };
