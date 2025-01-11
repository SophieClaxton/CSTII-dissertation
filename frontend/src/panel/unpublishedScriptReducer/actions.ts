import {
  CSTEndStepNode,
  CSTProgram,
  CSTSectionId,
  CSTSectionNode,
  CSTStepNodeType,
  CSTSubsectionId,
  CSTSubsectionNode,
} from '../models/CST/CST';
import { getEditorComponentById } from '../models/CST/getters';
import {
  mapProgramToProgramWithUpdatedSections,
  mapSectionToSectionWithUpdatedInnerSteps,
  mapSectionToSectionWithUpdatedEndStep,
  mapNodeIdToString,
} from '../models/CST/mappers';
import { isSubsection, isSection } from '../models/CST/testers';
import {
  AddInnerStepAction,
  RearrangeInnerStepsAction,
  AddEndStepAction,
  DeleteInnerStepAction,
  DeleteEndStepAction,
  EditInnerStepElementAction,
  EditEndStepElementAction,
} from '../models/EditorAction';
import { UnpublishedScript } from '../models/API/UnpublishedScript';

const getSection = (
  sectionId: CSTSectionId | CSTSubsectionId,
  program: CSTProgram,
): CSTSectionNode | CSTSubsectionNode | undefined => {
  const section = getEditorComponentById(program, sectionId);
  if (!section) {
    console.warn(
      `Did not find section with id ${mapNodeIdToString(sectionId)}`,
    );
    console.log(program);
    return undefined;
  }
  if (!(isSection(section) || isSubsection(section))) {
    console.warn(
      `Found a program component with id ${mapNodeIdToString(sectionId)} but it is not a section`,
    );
    console.log(section);
    return undefined;
  }
  return section;
};

/* InnerStep Actions */

const addInnerStep = (
  unpublishedScript: UnpublishedScript,
  action: AddInnerStepAction,
): UnpublishedScript => {
  const section = getSection(action.sectionId, unpublishedScript.program);
  if (!section) {
    return unpublishedScript;
  }
  console.log(`Adding inner step to section ${section.id}`);
  const newEditorProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    section.id,
    mapSectionToSectionWithUpdatedInnerSteps([
      ...section.innerSteps,
      action.innerStep,
    ]),
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
  const newEditorProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    section.id,
    mapSectionToSectionWithUpdatedInnerSteps(action.innerSteps),
  );
  return { ...unpublishedScript, program: newEditorProgram };
};

const editInnerStep = (
  unpublishedScript: UnpublishedScript,
  action: EditInnerStepElementAction,
): UnpublishedScript => {
  const section = getSection(action.stepId.parentId, unpublishedScript.program);
  if (!section) {
    return unpublishedScript;
  }
  const newEditorProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    section.id,
    mapSectionToSectionWithUpdatedInnerSteps(
      section.innerSteps.map((step) =>
        mapNodeIdToString(step.id) === mapNodeIdToString(action.stepId)
          ? { ...step, element: action.element }
          : step,
      ),
    ),
  );
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
  const newEditorProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    section.id,
    mapSectionToSectionWithUpdatedInnerSteps(
      section.innerSteps.filter(
        (step) =>
          mapNodeIdToString(step.id) != mapNodeIdToString(action.innerStepId),
      ),
    ),
  );
  return { ...unpublishedScript, program: newEditorProgram };
};

/* End Step Actions */

const addEndStep = (
  unpublishedScript: UnpublishedScript,
  action: AddEndStepAction,
): UnpublishedScript => {
  const section = getSection(action.sectionId, unpublishedScript.program);
  if (!section) {
    return unpublishedScript;
  }
  console.log(`Adding end step to section ${section.id}`);
  const newEditorProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    section.id,
    mapSectionToSectionWithUpdatedEndStep(action.endStep),
  );
  return {
    ...unpublishedScript,
    program: newEditorProgram,
  };
};

const editEndStep = (
  unpublishedScript: UnpublishedScript,
  action: EditEndStepElementAction,
): UnpublishedScript => {
  const section = getSection(action.stepId.parentId, unpublishedScript.program);
  if (!section || !section.endStep) {
    return unpublishedScript;
  }
  let newEndStep: CSTEndStepNode;
  switch (section.endStep.type) {
    case CSTStepNodeType.Follow:
      newEndStep = {
        type: section.endStep.type,
        id: section.endStep.id,
        element: action.element,
      };
      break;
    case CSTStepNodeType.UserDecision:
      newEndStep = section.endStep;
  }

  const newEditorProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    section.id,
    mapSectionToSectionWithUpdatedEndStep(newEndStep),
  );
  return { ...unpublishedScript, program: newEditorProgram };
};

const deleteEndStep = (
  unpublishedScript: UnpublishedScript,
  action: DeleteEndStepAction,
): UnpublishedScript => {
  const section = getSection(
    action.endStepId.parentId,
    unpublishedScript.program,
  );
  if (!section) {
    return unpublishedScript;
  }
  const newEditorProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    section.id,
    mapSectionToSectionWithUpdatedEndStep(undefined),
  );
  // console.log(newEditorProgram);
  return {
    ...unpublishedScript,
    program: newEditorProgram,
  };
};

export {
  addInnerStep,
  editInnerStep,
  rearrangeInnerSteps,
  deleteInnerStep,
  addEndStep,
  editEndStep,
  deleteEndStep,
};
