import { UnpublishedScript } from '../models/API/UnpublishedScript';
import { isSection } from '../models/CST/testers';
import {
  AddInnerStepAction,
  RearrangeInnerStepsAction,
  EditInnerStepElementAction,
  DeleteInnerStepAction,
} from '../models/EditorAction';
import { getSection } from './getters/nodes';
import { mapIdToString } from './mappers/nodeIds';
import {
  updateProgramSections,
  updateSectionInnerSteps,
} from './mappers/nodes';

const addInnerStep = (
  unpublishedScript: UnpublishedScript,
  action: AddInnerStepAction,
): UnpublishedScript => {
  const section = getSection(action.sectionId, unpublishedScript.program);
  if (!section) {
    return unpublishedScript;
  }
  console.log(`Adding inner step to section ${mapIdToString(section.id)}`);
  const newEditorProgram = updateProgramSections(
    unpublishedScript.program,
    section.id,
    updateSectionInnerSteps([...section.innerSteps, action.innerStep]),
  );
  // console.log(newEditorProgram);
  return {
    ...unpublishedScript,
    program: newEditorProgram,
  };
};

const rearrangeInnerSteps = (
  unpublishedScript: UnpublishedScript,
  action: RearrangeInnerStepsAction,
): UnpublishedScript => {
  const section = getSection(action.sectionId, unpublishedScript.program);
  if (!section) {
    return unpublishedScript;
  }
  const newEditorProgram = updateProgramSections(
    unpublishedScript.program,
    section.id,
    updateSectionInnerSteps(action.innerSteps),
  );
  return { ...unpublishedScript, program: newEditorProgram };
};

const editInnerStepElement = (
  unpublishedScript: UnpublishedScript,
  action: EditInnerStepElementAction,
): UnpublishedScript => {
  const section = getSection(action.stepId.parentId, unpublishedScript.program);
  if (!section) {
    return unpublishedScript;
  }
  const newEditorProgram = updateProgramSections(
    unpublishedScript.program,
    section.id,
    updateSectionInnerSteps(
      section.innerSteps.map((step) =>
        mapIdToString(step.id) === mapIdToString(action.stepId)
          ? { ...step, element: action.element }
          : step,
      ),
    ),
  );
  if (isSection(section) && section.url === '') {
    const url = action.oldUrl;
    return {
      ...unpublishedScript,
      program: {
        sections: newEditorProgram.sections.map((s) =>
          mapIdToString(s.id) === mapIdToString(section.id) ? { ...s, url } : s,
        ),
      },
    };
  }
  return { ...unpublishedScript, program: newEditorProgram };
};

const deleteInnerStep = (
  unpublishedScript: UnpublishedScript,
  action: DeleteInnerStepAction,
): UnpublishedScript => {
  const section = getSection(
    action.innerStepId.parentId,
    unpublishedScript.program,
  );
  if (!section) {
    return unpublishedScript;
  }
  const newEditorProgram = updateProgramSections(
    unpublishedScript.program,
    section.id,
    updateSectionInnerSteps(
      section.innerSteps.filter(
        (step) => mapIdToString(step.id) != mapIdToString(action.innerStepId),
      ),
    ),
  );
  return { ...unpublishedScript, program: newEditorProgram };
};

export {
  addInnerStep,
  editInnerStepElement,
  rearrangeInnerSteps,
  deleteInnerStep,
};
