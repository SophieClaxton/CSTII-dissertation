import {
  CSTSectionNode,
  CSTFollowNode,
  CSTProgram,
} from '../../models/CST/CST';
import {
  AddSectionAction,
  DeleteSectionAction,
} from '../../models/EditorAction';
import { getNextSectionId } from './getters/nodeIds';
import { getFollowNode, getFollowNodeFromNextSectionId } from './getters/nodes';
import { updateProgramSections, updateSectionEndStep } from './mappers/nodes';

const addSection = (
  program: CSTProgram,
  action: AddSectionAction,
): CSTProgram => {
  const id = getNextSectionId(program);
  const newSection: CSTSectionNode = {
    id: id,
    innerSteps: [],
    url: action.sectionUrl,
  };
  const followNode = getFollowNode(program, action.followStepId);
  if (!followNode) {
    return program;
  }
  const newFollowStep: CSTFollowNode = { ...followNode, nextSectionId: id };
  const updatedProgram = updateProgramSections(
    program,
    action.followStepId.parentId,
    updateSectionEndStep(newFollowStep),
  );
  // console.log(newFollowStep);
  // console.log(updatedProgram);
  return {
    ...program,
    sections: [...updatedProgram.sections, newSection],
  };
};

const deleteSection = (
  program: CSTProgram,
  action: DeleteSectionAction,
): CSTProgram => {
  if (program.sections.length === 1) {
    return {
      ...program,
      sections: program.sections.map((section) =>
        section.id === action.sectionId
          ? { url: '', id: section.id, innerSteps: [], endStep: undefined }
          : section,
      ),
    };
  }
  const newEditorProgram: CSTProgram = {
    ...program,
    sections: program.sections.filter(
      (section) => section.id != action.sectionId,
    ),
  };
  const followStep = getFollowNodeFromNextSectionId(
    newEditorProgram,
    action.sectionId,
  );
  if (followStep) {
    return updateProgramSections(
      newEditorProgram,
      followStep.id.parentId,
      updateSectionEndStep({
        ...followStep,
        nextSectionId: undefined,
        element: undefined,
      }),
    );
  }
  return newEditorProgram;
};

export { addSection, deleteSection };
