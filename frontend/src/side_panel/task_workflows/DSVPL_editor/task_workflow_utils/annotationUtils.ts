import {
  CSTProgram,
  CSTSection,
  CSTStepNode,
  CSTStepNodeType,
} from '../../../models/CST/CST';
import {
  mapWorkflowLocationToString,
  WorkflowLocation,
} from '../../../models/support_and_MII/UserSupport';
import { mapIdToString } from '../../unpublished_task_workflow_reducer/mappers/nodeIds';

const mapWorkflowLocationToStepId = (
  locationString: string,
  program: CSTProgram,
) => {
  const [stepNumberString, decisionHistoryString] = locationString.split('|');
  const stepNumber = Number(stepNumberString);
  const decisionHistory = (
    decisionHistoryString.length > 0 ? decisionHistoryString.split('-') : []
  ) as ('yes' | 'no')[];
  return getStepIdFromLocationInSection(
    { stepNumber, decisionHistory },
    program.sections[0],
    program,
  );
};

const getStepIdFromLocationInSection = (
  location: WorkflowLocation,
  section: CSTSection,
  program: CSTProgram,
): CSTStepNode['id'] => {
  if (location.stepNumber <= section.innerSteps.length) {
    return section.innerSteps[location.stepNumber - 1].id;
  }
  const endStep = section.endStep;
  if (!endStep) {
    throw new Error(
      `Cannot find step with task workflow location: ${mapWorkflowLocationToString(location)}`,
    );
  }
  const stepNumber = section.innerSteps.length + 1;
  if (location.stepNumber == stepNumber) {
    return endStep.id;
  }
  switch (endStep.type) {
    case CSTStepNodeType.Follow: {
      const nextSection = program.sections
        .filter(
          (section) =>
            mapIdToString(section.id) ===
            mapIdToString(endStep.nextSectionId ?? { sectionId: -1 }),
        )
        .at(0);
      if (!nextSection) {
        throw Error(
          `Cannot find next section with id: ${mapIdToString(endStep.nextSectionId ?? { sectionId: -1 })}`,
        );
      }
      return getStepIdFromLocationInSection(
        {
          ...location,
          stepNumber: location.stepNumber - stepNumber,
        },
        nextSection,
        program,
      );
    }
    case CSTStepNodeType.UserDecision: {
      const [decision, ...decisionHistory] = location.decisionHistory;
      if (decision === 'yes') {
        return getStepIdFromLocationInSection(
          {
            stepNumber: location.stepNumber - stepNumber,
            decisionHistory,
          },
          endStep.choice1,
          program,
        );
      } else {
        return getStepIdFromLocationInSection(
          {
            stepNumber: location.stepNumber - stepNumber,
            decisionHistory,
          },
          endStep.choice2,
          program,
        );
      }
    }
  }
};

export { mapWorkflowLocationToStepId as mapWorkflowLocationToStepId };
