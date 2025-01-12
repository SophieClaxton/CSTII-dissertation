import { UnpublishedScript } from '../models/API/UnpublishedScript';
import { CSTSectionNode, CSTFollowNode, CSTProgram } from '../models/CST/CST';
import { AddSectionAction, DeleteSectionAction } from '../models/EditorAction';
import { getNextSectionId } from './getters/nodeIds';
import { getFollowNode, getFollowNodeFromNextSectionId } from './getters/nodes';
import { mapIdToString } from './mappers/nodeIds';
import { updateProgramSections, updateSectionEndStep } from './mappers/nodes';

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
  const followNode = getFollowNode(
    unpublishedScript.program,
    action.followStepId,
  );
  if (!followNode) {
    return unpublishedScript;
  }
  const newFollowStep: CSTFollowNode = { ...followNode, nextSectionId: id };
  const updatedProgram = updateProgramSections(
    unpublishedScript.program,
    action.followStepId.parentId,
    updateSectionEndStep(newFollowStep),
  );
  console.log(newFollowStep);
  console.log(updatedProgram);
  const newEditorProgram: CSTProgram = {
    ...unpublishedScript.program,
    sections: [...updatedProgram.sections, newSection],
  };
  console.log(`Created section with id ${mapIdToString(id)}`);
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
  const followStep = getFollowNodeFromNextSectionId(
    newEditorProgram,
    action.sectionId,
  );
  if (followStep) {
    const updatedProgram = updateProgramSections(
      newEditorProgram,
      followStep.id.parentId,
      updateSectionEndStep({
        ...followStep,
        nextSectionId: undefined,
        element: undefined,
      }),
    );
    return { ...unpublishedScript, program: updatedProgram };
  }
  return { ...unpublishedScript, program: newEditorProgram };
};

export { addSection, deleteSection };
