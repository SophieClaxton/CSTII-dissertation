import InterfaceElement from '../InterfaceElement';
import {
  CSTEndStepNode,
  CSTInnerStepNode,
  CSTNodeId,
  CSTProgram,
  CSTSectionId,
  CSTSectionNode,
  CSTStepNode,
  CSTStepNodeType,
  CSTSubsectionId,
  CSTSubsectionNode,
} from './CST';

const mapNodeIdToString = (nodeId: CSTNodeId): string => {
  if ('sectionId' in nodeId) {
    return `S${nodeId.sectionId}`;
  } else if ('subsectionId' in nodeId) {
    return `${mapNodeIdToString(nodeId.parentId)}.s${nodeId.subsectionId}`;
  } else if ('stepId' in nodeId) {
    return `${mapNodeIdToString(nodeId.parentId)}.${nodeId.stepId}`;
  }
  throw new Error(`Could not translate node id ${nodeId}`);
};

const mapProgramToProgramWithUpdatedSections = (
  program: CSTProgram,
  sectionId: CSTSectionId | CSTSubsectionId,
  onUpdateSection: (
    section: CSTSectionNode,
    sectionId: CSTSectionId | CSTSubsectionId,
  ) => CSTSectionNode,
) => {
  return {
    ...program,
    sections: program.sections.map((section) =>
      onUpdateSection(section, sectionId),
    ),
  };
};

const mapSectionToSectionWithUpdatedInnerSteps =
  (innerSteps: CSTInnerStepNode[]) =>
  (
    section: CSTSectionNode,
    sectionId: CSTSectionId | CSTSubsectionId,
  ): CSTSectionNode => {
    if (section.id == sectionId) {
      console.log('Found section to update steps');
      return {
        ...section,
        innerSteps: innerSteps,
      };
    }
    return {
      ...section,
      innerSteps: section.innerSteps.map(
        (step) =>
          mapStepToStepWithUpdatedInnerSteps(
            step,
            sectionId,
            innerSteps,
          ) as CSTInnerStepNode,
      ),
      endStep: section.endStep
        ? (mapStepToStepWithUpdatedInnerSteps(
            section.endStep,
            sectionId,
            innerSteps,
          ) as CSTEndStepNode)
        : section.endStep,
    };
  };

const mapSubsectionToSubsectionWithUpdatedInnerSteps = (
  subsection: CSTSubsectionNode,
  sectionId: CSTSectionId | CSTSubsectionId,
  innerSteps: CSTInnerStepNode[],
): CSTSubsectionNode => {
  if (subsection.id == sectionId) {
    console.log('Found subsection to update steps');
    return {
      ...subsection,
      innerSteps: innerSteps,
    };
  }
  return {
    ...subsection,
    innerSteps: subsection.innerSteps.map(
      (step) =>
        mapStepToStepWithUpdatedInnerSteps(
          step,
          sectionId,
          innerSteps,
        ) as CSTInnerStepNode,
    ),
    endStep: subsection.endStep
      ? (mapStepToStepWithUpdatedInnerSteps(
          subsection.endStep,
          sectionId,
          innerSteps,
        ) as CSTEndStepNode)
      : subsection.endStep,
  };
};

const mapInnerStepToChangedInnerStep = (
  step: CSTInnerStepNode & { element?: InterfaceElement },
  element: InterfaceElement | undefined,
): CSTInnerStepNode & { element?: InterfaceElement } => {
  return {
    ...step,
    element: element ? element : step.element,
  };
};

const mapStepToStepWithUpdatedInnerSteps = (
  step: CSTStepNode,
  sectionId: CSTSectionId | CSTSubsectionId,
  innerSteps: CSTInnerStepNode[],
): CSTStepNode => {
  if (step.type == CSTStepNodeType.UserDecision) {
    return {
      ...step,
      choice1: mapSubsectionToSubsectionWithUpdatedInnerSteps(
        step.choice1,
        sectionId,
        innerSteps,
      ),
      choice2: mapSubsectionToSubsectionWithUpdatedInnerSteps(
        step.choice2,
        sectionId,
        innerSteps,
      ),
    };
  }
  return step;
};

const mapSectionToSectionWithUpdatedEndStep =
  (endStep: CSTEndStepNode | undefined) =>
  (
    section: CSTSectionNode,
    sectionId: CSTSectionId | CSTSubsectionId,
  ): CSTSectionNode => {
    if (section.id == sectionId) {
      console.log('Found section to update steps');
      return {
        ...section,
        endStep: endStep,
      };
    }
    return {
      ...section,
      innerSteps: section.innerSteps.map(
        (step) =>
          mapStepToStepWithUpdatedEndStep(
            step,
            sectionId,
            endStep,
          ) as CSTInnerStepNode,
      ),
      endStep: section.endStep
        ? (mapStepToStepWithUpdatedEndStep(
            section.endStep,
            sectionId,
            endStep,
          ) as CSTEndStepNode)
        : section.endStep,
    };
  };

const mapSubsectionToSubsectionWithUpdatedEndStep = (
  subsection: CSTSubsectionNode,
  sectionId: CSTSectionId | CSTSubsectionId,
  endStep: CSTEndStepNode | undefined,
): CSTSubsectionNode => {
  if (subsection.id == sectionId) {
    console.log('Found subsection to update steps');
    return {
      ...subsection,
      endStep: endStep,
    };
  }
  return {
    ...subsection,
    innerSteps: subsection.innerSteps.map(
      (step) =>
        mapStepToStepWithUpdatedEndStep(
          step,
          sectionId,
          endStep,
        ) as CSTInnerStepNode,
    ),
    endStep: subsection.endStep
      ? (mapStepToStepWithUpdatedEndStep(
          subsection.endStep,
          sectionId,
          endStep,
        ) as CSTEndStepNode)
      : subsection.endStep,
  };
};

const mapStepToStepWithUpdatedEndStep = (
  step: CSTStepNode | undefined,
  sectionId: CSTSectionId | CSTSubsectionId,
  endStep: CSTEndStepNode | undefined,
) => {
  if (step && step.type == CSTStepNodeType.UserDecision) {
    return {
      ...step,
      choice1: mapSubsectionToSubsectionWithUpdatedEndStep(
        step.choice1,
        sectionId,
        endStep,
      ),
      choice2: mapSubsectionToSubsectionWithUpdatedEndStep(
        step.choice2,
        sectionId,
        endStep,
      ),
    };
  }
  return step;
};

export {
  mapNodeIdToString,
  mapProgramToProgramWithUpdatedSections,
  mapSectionToSectionWithUpdatedInnerSteps,
  mapSectionToSectionWithUpdatedEndStep,
  mapInnerStepToChangedInnerStep,
};
