import { CSTProgram } from '../models/CST/CST';
import { isEndStepId, isInnerStep, isInnerStepId } from '../models/CST/testers';
import {
  AddStepAction,
  DeleteStepAction,
  EditStepElementAction,
  EditUserDecisionQuestion,
} from '../models/EditorAction';
import {
  addEndStep,
  deleteEndStep,
  editEndStepElement,
} from './endStepActions';
import { getSection } from './getters/nodes';
import {
  addInnerStep,
  deleteInnerStep,
  editInnerStepElement,
} from './innerStepActions';
import { mapIdToString } from './mappers/nodeIds';
import {
  updateProgramSections,
  updateSectionEndStep,
  updateSectionInnerSteps,
} from './mappers/nodes';

const addStep = (program: CSTProgram, action: AddStepAction) => {
  if (isInnerStep(action.step)) {
    return addInnerStep(program, action.step);
  } else {
    return addEndStep(program, action.step);
  }
};

const editStepElement = (
  program: CSTProgram,
  action: EditStepElementAction,
) => {
  if (isInnerStepId(action.stepId)) {
    return editInnerStepElement(program, action.stepId, action.element);
  } else {
    return editEndStepElement(program, action.stepId, action.element);
  }
};

const deleteStep = (program: CSTProgram, action: DeleteStepAction) => {
  if (isInnerStepId(action.stepId)) {
    return deleteInnerStep(program, action.stepId);
  } else {
    return deleteEndStep(program, action.stepId);
  }
};

const editUserDecisionQuestion = (
  program: CSTProgram,
  action: EditUserDecisionQuestion,
) => {
  const section = getSection(action.stepId.parentId, program);
  if (!section || !section.endStep) {
    return program;
  }

  if (isEndStepId(action.stepId)) {
    const newEndStep = { ...section.endStep, question: action.question };
    return updateProgramSections(
      program,
      section.id,
      updateSectionEndStep(newEndStep),
    );
  } else {
    return updateProgramSections(
      program,
      section.id,
      updateSectionInnerSteps(
        section.innerSteps.map((step) =>
          mapIdToString(step.id) === mapIdToString(action.stepId)
            ? { ...step, question: action.question }
            : step,
        ),
      ),
    );
  }
};

export { addStep, editStepElement, deleteStep, editUserDecisionQuestion };
