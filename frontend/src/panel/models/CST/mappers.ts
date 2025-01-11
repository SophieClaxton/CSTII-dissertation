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
import {
  isEndStepId,
  isInnerStepId,
  isSectionId,
  isSubsectionId,
} from './testers';

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

const getSuffixOfNodeIdString = (string: string): number => {
  return parseInt(string.slice(1, string.length));
};

const mapStringToNodeId = (string: string): CSTNodeId => {
  const nodeIdChunks = string.split('.');
  if (nodeIdChunks.length === 0) {
    throw Error(`invalid node id string ${string}: no chunks`);
  }
  let nodeId: CSTNodeId = {
    sectionId: getSuffixOfNodeIdString(nodeIdChunks[0]),
  };
  for (const nodeIdChunk of nodeIdChunks.slice(1, nodeIdChunks.length)) {
    switch (nodeIdChunk[0]) {
      case 's':
        if (isSectionId(nodeId) || isSubsectionId(nodeId)) {
          console.warn(nodeId);
          throw Error(
            `invalid node id string ${string}: found subsection after Section`,
          );
        }
        nodeId = {
          parentId: nodeId,
          subsectionId: getSuffixOfNodeIdString(nodeIdChunk),
        };
        break;
      case 'E':
        if (isInnerStepId(nodeId) || isEndStepId(nodeId)) {
          console.warn(nodeId);
          throw Error(
            `invalid node id string ${string}: found endStep after innerNode or endNode`,
          );
        }
        nodeId = {
          parentId: nodeId,
          stepId: 'E',
        };
        break;
      default:
        if (isInnerStepId(nodeId) || isEndStepId(nodeId)) {
          console.warn(nodeId);
          throw Error(
            `invalid node id string ${string}: found innerStep after innerNode or endNode`,
          );
        }
        nodeId = {
          parentId: nodeId,
          stepId: parseInt(nodeIdChunk),
        };
    }
  }
  return nodeId;
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
  mapStringToNodeId,
  mapProgramToProgramWithUpdatedSections,
  mapSectionToSectionWithUpdatedInnerSteps,
  mapSectionToSectionWithUpdatedEndStep,
};
