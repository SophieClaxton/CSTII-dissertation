import {
  CSTSectionNode,
  CSTSubsectionNode,
  CSTInnerStepId,
  CSTProgram,
  CSTSectionId,
} from '../../../models/CST/CST';

const getNextInnerStepId = (
  sectionNode: CSTSectionNode | CSTSubsectionNode,
): CSTInnerStepId => {
  const innerStepIds = sectionNode.innerSteps.map((step) => step.id.stepId);
  const maxInnerStepId = innerStepIds.length ? Math.max(...innerStepIds) : 0;
  return { parentId: sectionNode.id, stepId: maxInnerStepId + 1 };
};

const getNextSectionId = (editorProgram: CSTProgram): CSTSectionId => {
  const sectionIds = editorProgram.sections.map(
    (section) => section.id.sectionId,
  );
  const maxSectionId = sectionIds.length > 0 ? Math.max(...sectionIds) : 0;
  return { sectionId: maxSectionId + 1 };
};

export { getNextInnerStepId, getNextSectionId };
