import {
  CSTProgram,
  CSTSection,
  CSTSectionNode,
  CSTInnerStepNode,
  CSTStepNode,
  CSTStepNodeType,
  CSTEndStepNode,
} from '../../models/CST/CST';
import { mapIdToString } from './nodeIds';

const updateProgramSections = (
  program: CSTProgram,
  sectionId: CSTSection['id'],
  onUpdateSection: (
    section: CSTSectionNode,
    sectionId: CSTSection['id'],
  ) => CSTSectionNode,
): CSTProgram => {
  return {
    ...program,
    sections: program.sections.map((section) =>
      onUpdateSection(section, sectionId),
    ),
  };
};

const updateSectionInnerSteps =
  <T extends CSTSection>(innerSteps: CSTInnerStepNode[]) =>
  (section: T, sectionId: CSTSection['id']): T => {
    if (mapIdToString(section.id) === mapIdToString(sectionId)) {
      console.log('Found section to update steps');
      return {
        ...section,
        innerSteps: innerSteps,
      };
    }
    const updateInnerSteps = updateStepInnerSteps(innerSteps);
    return {
      ...section,
      innerSteps: section.innerSteps.map((step) =>
        updateInnerSteps(step, sectionId),
      ),
      endStep: section.endStep
        ? updateInnerSteps(section.endStep, sectionId)
        : section.endStep,
    };
  };

const updateStepInnerSteps =
  <T extends CSTStepNode>(innerSteps: CSTInnerStepNode[]) =>
  (step: T, sectionId: CSTSection['id']): T => {
    if (step.type == CSTStepNodeType.UserDecision) {
      const onUpdateInnerSteps = updateSectionInnerSteps(innerSteps);
      return {
        ...step,
        choice1: onUpdateInnerSteps(step.choice1, sectionId),
        choice2: onUpdateInnerSteps(step.choice2, sectionId),
      };
    }
    return step;
  };

const updateSectionEndStep =
  <T extends CSTSection>(endStep: CSTEndStepNode | undefined) =>
  (section: T, sectionId: CSTSection['id']): T => {
    if (mapIdToString(section.id) === mapIdToString(sectionId)) {
      console.log('Found section to update steps');
      return {
        ...section,
        endStep: endStep,
      };
    }
    const onUpdateEndSteps = updateStepEndStep(endStep);
    return {
      ...section,
      innerSteps: section.innerSteps.map((step) =>
        onUpdateEndSteps(step, sectionId),
      ),
      endStep: section.endStep
        ? onUpdateEndSteps(section.endStep, sectionId)
        : section.endStep,
    };
  };

const updateStepEndStep =
  <T extends CSTStepNode>(endStep: CSTEndStepNode | undefined) =>
  (step: T, sectionId: CSTSection['id']): T => {
    if (step.type === CSTStepNodeType.UserDecision) {
      const onUpdateEndSteps = updateSectionEndStep(endStep);
      return {
        ...step,
        choice1: onUpdateEndSteps(step.choice1, sectionId),
        choice2: onUpdateEndSteps(step.choice2, sectionId),
      };
    }
    return step;
  };

export {
  updateProgramSections,
  updateSectionEndStep,
  updateSectionInnerSteps,
  updateStepEndStep,
  updateStepInnerSteps,
};
