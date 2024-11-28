import {
  EditorEndStep,
  EditorFollowStep,
  EditorInnerStep,
  EditorProgram,
  EditorSection,
  EditorStep,
  EditorStepType,
  EditorSubsection,
} from './ProgramComponent';

const mapEditorFollowStepToId = (followStep: EditorFollowStep) => {
  return `${followStep.parentSectionId}F`;
};

const mapProgramToProgramWithUpdatedSections = (
  program: EditorProgram,
  sectionId: string,
  onUpdateSection: (section: EditorSection, sectionId: string) => EditorSection,
) => {
  return {
    ...program,
    sections: program.sections.map((section) =>
      onUpdateSection(section, sectionId),
    ),
  };
};

const mapSectionToSectionWithUpdatedInnerSteps =
  (innerSteps: EditorInnerStep[]) =>
  (section: EditorSection, sectionId: string): EditorSection => {
    if (section.id == sectionId) {
      console.log('Found section to update steps');
      return {
        ...section,
        url: section.url,
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
          ) as EditorInnerStep,
      ),
      endStep: section.endStep
        ? (mapStepToStepWithUpdatedInnerSteps(
            section.endStep,
            sectionId,
            innerSteps,
          ) as EditorEndStep)
        : section.endStep,
    };
  };

const mapSubsectionToSubsectionWithUpdatedInnerSteps = (
  subsection: EditorSubsection,
  sectionId: string,
  innerSteps: EditorInnerStep[],
): EditorSubsection => {
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
        ) as EditorInnerStep,
    ),
    endStep: subsection.endStep
      ? (mapStepToStepWithUpdatedInnerSteps(
          subsection.endStep,
          sectionId,
          innerSteps,
        ) as EditorEndStep)
      : subsection.endStep,
  };
};

const mapStepToStepWithUpdatedInnerSteps = (
  step: EditorStep,
  sectionId: string,
  innerSteps: EditorInnerStep[],
) => {
  if (step.type == EditorStepType.UserDecision) {
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

export {
  mapEditorFollowStepToId,
  mapProgramToProgramWithUpdatedSections,
  mapSectionToSectionWithUpdatedInnerSteps,
};
