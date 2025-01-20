import {
  CSTEndStepId,
  CSTEndStepNode,
  CSTProgram,
  CSTStepNodeType,
} from '../models/CST/CST';
import { isSection } from '../models/CST/testers';
import InterfaceElement from '../models/InterfaceElement';
import { getSection } from './getters/nodes';
import { mapIdToString } from './mappers/nodeIds';
import { updateProgramSections, updateSectionEndStep } from './mappers/nodes';

const addEndStep = (
  program: CSTProgram,
  endStep: CSTEndStepNode,
): CSTProgram => {
  const section = getSection(endStep.id.parentId, program);
  if (!section) {
    return program;
  }
  console.log(`Adding end step to section ${mapIdToString(section.id)}`);
  return updateProgramSections(
    program,
    section.id,
    updateSectionEndStep(endStep),
  );
};

const editEndStepElement = (
  program: CSTProgram,
  endStepId: CSTEndStepId,
  element: InterfaceElement | undefined,
  url: string,
): CSTProgram => {
  const section = getSection(endStepId.parentId, program);
  if (!section || !section.endStep) {
    return program;
  }
  let newEndStep: CSTEndStepNode;
  switch (section.endStep.type) {
    case CSTStepNodeType.Follow:
      newEndStep = {
        type: section.endStep.type,
        id: section.endStep.id,
        element: element,
      };
      break;
    case CSTStepNodeType.UserDecision:
      newEndStep = section.endStep;
  }

  const newEditorProgram = updateProgramSections(
    program,
    section.id,
    updateSectionEndStep(newEndStep),
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

const deleteEndStep = (
  program: CSTProgram,
  endStepId: CSTEndStepId,
): CSTProgram => {
  const section = getSection(endStepId.parentId, program);
  if (!section) {
    return program;
  }
  return updateProgramSections(
    program,
    section.id,
    updateSectionEndStep(undefined),
  );
};

export { addEndStep, editEndStepElement, deleteEndStep };
