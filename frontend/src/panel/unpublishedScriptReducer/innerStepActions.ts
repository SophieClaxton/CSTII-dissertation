import {
  CSTInnerStepId,
  CSTInnerStepNode,
  CSTProgram,
  CSTStepNodeType,
} from '../models/CST/CST';
import { isSection } from '../models/CST/testers';
import {
  EditInputStepDescriptionAction,
  EditIsCheckedAction,
  RearrangeInnerStepsAction,
} from '../models/EditorAction';
import InterfaceElement from '../models/InterfaceElement';
import { getSection } from './getters/nodes';
import { mapIdToString } from './mappers/nodeIds';
import {
  updateProgramSections,
  updateSectionInnerSteps,
} from './mappers/nodes';

const addInnerStep = (
  program: CSTProgram,
  innerStep: CSTInnerStepNode,
): CSTProgram => {
  const section = getSection(innerStep.id.parentId, program);
  if (!section) {
    return program;
  }
  console.log(`Adding inner step to section ${mapIdToString(section.id)}`);
  return updateProgramSections(
    program,
    section.id,
    updateSectionInnerSteps([...section.innerSteps, innerStep]),
  );
};

const rearrangeInnerSteps = (
  program: CSTProgram,
  action: RearrangeInnerStepsAction,
): CSTProgram => {
  const section = getSection(action.sectionId, program);
  if (!section) {
    return program;
  }
  return updateProgramSections(
    program,
    section.id,
    updateSectionInnerSteps(action.innerSteps),
  );
};

const editInnerStepElement = (
  program: CSTProgram,
  innerStepId: CSTInnerStepId,
  element: InterfaceElement | undefined,
  url: string,
): CSTProgram => {
  const section = getSection(innerStepId.parentId, program);
  if (!section) {
    return program;
  }
  const newEditorProgram = updateProgramSections(
    program,
    section.id,
    updateSectionInnerSteps(
      section.innerSteps.map((step) =>
        mapIdToString(step.id) === mapIdToString(innerStepId)
          ? { ...step, element: element }
          : step,
      ),
    ),
  );
  if (isSection(section) && section.url === '') {
    return {
      sections: newEditorProgram.sections.map((s) =>
        mapIdToString(s.id) === mapIdToString(section.id) ? { ...s, url } : s,
      ),
    };
  }
  return newEditorProgram;
};

const addInputDescriptionToInput = (
  step: CSTInnerStepNode,
  description: string,
  isExact: boolean,
): CSTInnerStepNode => {
  console.log('Adding input description to step');
  const maybeDescription = description.length > 0 ? description : undefined;
  switch (step.type) {
    case CSTStepNodeType.Write:
      return { ...step, text: maybeDescription, isExact };
    case CSTStepNodeType.Select:
      return { ...step, option: maybeDescription };
    case CSTStepNodeType.Draw:
      return { ...step, description: maybeDescription };
    default:
      return step;
  }
};

const editInputStepInputDescription = (
  program: CSTProgram,
  action: EditInputStepDescriptionAction,
) => {
  const { stepId, description, isExact } = action;
  const section = getSection(stepId.parentId, program);
  if (!section) {
    return program;
  }
  console.log(section);
  console.log(stepId);
  return updateProgramSections(
    program,
    section.id,
    updateSectionInnerSteps(
      section.innerSteps.map((step) =>
        mapIdToString(step.id) === mapIdToString(stepId)
          ? addInputDescriptionToInput(step, description, isExact)
          : step,
      ),
    ),
  );
};

const editIsChecked = (program: CSTProgram, action: EditIsCheckedAction) => {
  const { stepId, isChecked } = action;
  const section = getSection(stepId.parentId, program);
  if (!section) {
    return program;
  }
  return updateProgramSections(
    program,
    section.id,
    updateSectionInnerSteps(
      section.innerSteps.map((step) =>
        mapIdToString(step.id) === mapIdToString(stepId)
          ? { ...step, isChecked }
          : step,
      ),
    ),
  );
};

const deleteInnerStep = (
  program: CSTProgram,
  stepId: CSTInnerStepId,
): CSTProgram => {
  const section = getSection(stepId.parentId, program);
  if (!section) {
    return program;
  }
  return updateProgramSections(
    program,
    section.id,
    updateSectionInnerSteps(
      section.innerSteps.filter(
        (step) => mapIdToString(step.id) != mapIdToString(stepId),
      ),
    ),
  );
};

export {
  addInnerStep,
  editInnerStepElement,
  editInputStepInputDescription,
  editIsChecked,
  addInputDescriptionToInput,
  rearrangeInnerSteps,
  deleteInnerStep,
};
