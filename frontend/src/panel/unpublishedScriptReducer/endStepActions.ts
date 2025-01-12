import { UnpublishedScript } from '../models/API/UnpublishedScript';
import { CSTEndStepNode, CSTStepNodeType } from '../models/CST/CST';
import { isSection } from '../models/CST/testers';
import {
  AddEndStepAction,
  EditEndStepElementAction,
  DeleteEndStepAction,
} from '../models/EditorAction';
import { getSection } from './getters/nodes';
import { mapIdToString } from './mappers/nodeIds';
import { updateProgramSections, updateSectionEndStep } from './mappers/nodes';

const addEndStep = (
  unpublishedScript: UnpublishedScript,
  action: AddEndStepAction,
): UnpublishedScript => {
  const section = getSection(action.sectionId, unpublishedScript.program);
  if (!section) {
    return unpublishedScript;
  }
  console.log(`Adding end step to section ${mapIdToString(section.id)}`);
  const newEditorProgram = updateProgramSections(
    unpublishedScript.program,
    section.id,
    updateSectionEndStep(action.endStep),
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

  const newEditorProgram = updateProgramSections(
    unpublishedScript.program,
    section.id,
    updateSectionEndStep(newEndStep),
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
  const newEditorProgram = updateProgramSections(
    unpublishedScript.program,
    section.id,
    updateSectionEndStep(undefined),
  );
  // console.log(newEditorProgram);
  return {
    ...unpublishedScript,
    program: newEditorProgram,
  };
};

export { addEndStep, editEndStepElement, deleteEndStep };
