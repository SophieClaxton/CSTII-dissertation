import {
  CSTEndStepId,
  CSTEndStepNode,
  CSTFollowNode,
  CSTNodeId,
  CSTProgram,
  CSTSectionId,
  CSTSectionNode,
  CSTStepNodeType,
  CSTSubsectionId,
  CSTSubsectionNode,
} from '../models/CST/CST';
import {
  getEditorComponentById,
  getNextSectionId,
} from '../models/CST/getters';
import {
  mapProgramToProgramWithUpdatedSections,
  mapSectionToSectionWithUpdatedInnerSteps,
  mapSectionToSectionWithUpdatedEndStep,
  mapNodeIdToString,
} from '../models/CST/mappers';
import {
  isSubsection,
  isSection,
  isEndStep,
  isEndStepId,
  isInnerStepId,
  isSubsectionId,
} from '../models/CST/testers';
import {
  AddInnerStepAction,
  RearrangeInnerStepsAction,
  AddEndStepAction,
  DeleteInnerStepAction,
  DeleteEndStepAction,
  EditInnerStepElementAction,
  EditEndStepElementAction,
  AddSectionAction,
  DeleteSectionAction,
} from '../models/EditorAction';
import { UnpublishedScript } from '../models/API/UnpublishedScript';

const getParentSection = (
  nodeId: CSTNodeId,
  program: CSTProgram,
): CSTSectionNode => {
  if (isInnerStepId(nodeId) || isEndStepId(nodeId) || isSubsectionId(nodeId)) {
    return getParentSection(nodeId.parentId, program);
  } else {
    const section = getSection(nodeId, program);
    if (!section || !isSection(section)) {
      throw Error(`No section with id ${mapNodeIdToString(nodeId)}`);
    }
    return section;
  }
};

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

const getFollowStep = (
  program: CSTProgram,
  followStepId: CSTEndStepId,
): CSTFollowNode | undefined => {
  const step = getEditorComponentById(program, followStepId);
  if (!step) {
    console.warn(
      `Did not find step with id ${mapNodeIdToString(followStepId)}`,
    );
    console.log(program);
    return undefined;
  }
  if (!isEndStep(step) || step.type != CSTStepNodeType.Follow) {
    console.warn(
      `Found a program component with id ${mapNodeIdToString(followStepId)} but it is not a follow step`,
    );
    console.log(step);
    return undefined;
  }
  return step;
};

/* Section Actions */

const addSection = (
  unpublishedScript: UnpublishedScript,
  action: AddSectionAction,
): UnpublishedScript => {
  const id = getNextSectionId(unpublishedScript.program);
  const newSection: CSTSectionNode = {
    id: id,
    innerSteps: [],
    url: action.sectionUrl,
  };
  const followStep = getFollowStep(
    unpublishedScript.program,
    action.followStepId,
  );
  if (!followStep) {
    return unpublishedScript;
  }
  const newFollowStep: CSTFollowNode = { ...followStep, nextSectionId: id };
  const updatedProgram = mapProgramToProgramWithUpdatedSections(
    unpublishedScript.program,
    action.followStepId.parentId,
    mapSectionToSectionWithUpdatedEndStep(newFollowStep),
  );
  console.log(newFollowStep);
  console.log(updatedProgram);
  const newEditorProgram: CSTProgram = {
    ...unpublishedScript.program,
    sections: [...updatedProgram.sections, newSection],
  };
  console.log(`Created section with id ${mapNodeIdToString(id)}`);
  console.log(newEditorProgram);
  return { ...unpublishedScript, program: newEditorProgram };
};

const deleteSection = (
  unpublishedScript: UnpublishedScript,
  action: DeleteSectionAction,
): UnpublishedScript => {
  if (action.sectionId.sectionId === 1) {
    const newEditorProgram: CSTProgram = {
      ...unpublishedScript.program,
      sections: unpublishedScript.program.sections.map((section) =>
        section.id === action.sectionId
          ? { url: '', id: section.id, innerSteps: [], endStep: undefined }
          : section,
      ),
    };
    return { ...unpublishedScript, program: newEditorProgram };
  }
  const newEditorProgram: CSTProgram = {
    ...unpublishedScript.program,
    sections: unpublishedScript.program.sections.filter(
      (section) => section.id != action.sectionId,
    ),
  };
  return { ...unpublishedScript, program: newEditorProgram };
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
  console.log(`Adding inner step to section ${mapNodeIdToString(section.id)}`);
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

const editInnerStepElement = (
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
  if (isSection(section) && section.url === '') {
    const url = action.oldUrl;
    return {
      ...unpublishedScript,
      program: {
        sections: newEditorProgram.sections.map((s) =>
          mapNodeIdToString(s.id) === mapNodeIdToString(section.id)
            ? { ...s, url }
            : s,
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
  console.log(`Adding end step to section ${mapNodeIdToString(section.id)}`);
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

const editEndStepElement = (
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

  if (isSection(section) && section.url === '') {
    const url = action.oldUrl;
    return {
      ...unpublishedScript,
      program: {
        sections: newEditorProgram.sections.map((s) =>
          mapNodeIdToString(s.id) === mapNodeIdToString(section.id)
            ? { ...s, url }
            : s,
        ),
      },
    };
  }
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
  addSection,
  getParentSection,
  deleteSection,
  addInnerStep,
  editInnerStepElement,
  rearrangeInnerSteps,
  deleteInnerStep,
  addEndStep,
  editEndStepElement,
  deleteEndStep,
};
