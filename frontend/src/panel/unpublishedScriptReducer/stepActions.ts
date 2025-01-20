import { CSTProgram } from '../models/CST/CST';
import { isInnerStep, isInnerStepId } from '../models/CST/testers';
import {
  AddStepAction,
  DeleteStepAction,
  EditStepElementAction,
} from '../models/EditorAction';
import {
  addEndStep,
  deleteEndStep,
  editEndStepElement,
} from './endStepActions';
import {
  addInnerStep,
  deleteInnerStep,
  editInnerStepElement,
} from './innerStepActions';

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
    return editInnerStepElement(
      program,
      action.stepId,
      action.element,
      action.oldUrl,
    );
  } else {
    return editEndStepElement(
      program,
      action.stepId,
      action.element,
      action.oldUrl,
    );
  }
};

const deleteStep = (program: CSTProgram, action: DeleteStepAction) => {
  if (isInnerStepId(action.stepId)) {
    return deleteInnerStep(program, action.stepId);
  } else {
    return deleteEndStep(program, action.stepId);
  }
};

export { addStep, editStepElement, deleteStep };
