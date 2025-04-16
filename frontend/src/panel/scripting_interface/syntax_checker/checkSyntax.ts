import { ASTNodeType, ASTSectionNode, ASTStepNode } from '../../models/AST/AST';
import {
  CSTEndStepNode,
  CSTInnerStepNode,
  CSTProgram,
  CSTSectionNode,
  CSTStepNodeType,
  CSTSubsectionNode,
  CSTUserDecisionEndStepNode,
  CSTUserDecisionInnerStepNode,
} from '../../models/CST/CST';
import {
  IncompleteEndStep,
  IncompleteInnerStep,
  IncompleteSection,
  IncompleteSubsection,
  SyntaxCheckError,
  SyntaxCheckErrors,
  SyntaxCheckResult,
} from '../../models/SyntaxCheck';
import { mapIdToString } from '../unpublished_script_reducer/mappers/nodeIds';
import {
  checkClickNode,
  checkReadNode,
  checkScrollToNode,
  checkDragNode,
  checkWriteNode,
  checkSelectNode,
  checkDrawNode,
  checkFollowNode,
} from './checkSyntaxSteps';

const checkSyntax = (program: CSTProgram): SyntaxCheckResult => {
  const incompleteSectionsMap: Map<
    string,
    IncompleteSection | SyntaxCheckErrors
  > = new Map();
  program.sections.forEach((section) =>
    incompleteSectionsMap.set(mapIdToString(section.id), checkSection(section)),
  );

  let errors: SyntaxCheckError[] = [];
  const sectionErrors = Array.from(incompleteSectionsMap.values()).filter(
    (result) => result.type === 'syntax_error',
  );
  if (sectionErrors.length > 0) {
    errors = [
      ...errors,
      ...sectionErrors.reduce((prev, current) => ({
        type: 'syntax_error',
        errors: [...prev.errors, ...current.errors],
      })).errors,
    ];
  }
  if (errors.length > 0) {
    return { success: false, errors };
  } else {
    const sectionsMap = incompleteSectionsMap as Map<string, IncompleteSection>;
    const completeSections = new Map<string, ASTSectionNode>();

    for (const [id, incompleteSection] of Array.from(
      sectionsMap.entries(),
    ).reverse()) {
      const nextSections = [];
      for (const nextSectionId of incompleteSection.missingSectionIds) {
        const nextSection = completeSections.get(mapIdToString(nextSectionId));
        if (!nextSection) {
          throw new Error(`Have not completed section ${nextSectionId}`);
        }
        nextSections.push(nextSection);
      }
      const completedSection = incompleteSection.getSection(nextSections);
      completeSections.set(id, completedSection);
    }

    const startSection = completeSections.get(
      mapIdToString(program.sections.at(0)!.id),
    );
    if (!startSection) {
      throw new Error('Could not find first section');
    }
    return {
      success: true,
      program: { start: startSection },
    };
  }
};

const checkSection = (
  section: CSTSectionNode,
): IncompleteSection | SyntaxCheckErrors => {
  let errors: SyntaxCheckError[] =
    section.url.length === 0
      ? [{ location: section.id, reason: 'Missing url' }]
      : [];

  const incompleteInnerSteps = section.innerSteps.map((innerStep) =>
    checkInnerStep(innerStep),
  );

  const innerStepErrors = incompleteInnerSteps.filter(
    (result) => result.type === 'syntax_error',
  );
  if (innerStepErrors.length > 0) {
    errors = [
      ...errors,
      ...innerStepErrors.reduce((prev, current) => ({
        type: 'syntax_error',
        errors: [...prev.errors, ...current.errors],
      })).errors,
    ];
  }

  const incompleteEndStep = section.endStep
    ? checkEndStep(section.endStep)
    : undefined;

  if (incompleteEndStep && incompleteEndStep.type === 'syntax_error') {
    errors = [...errors, ...incompleteEndStep.errors];
  }

  if (errors.length > 0) {
    return { type: 'syntax_error', errors };
  } else {
    const endStep = incompleteEndStep
      ? (incompleteEndStep as IncompleteEndStep)
      : undefined;
    const innerSteps = incompleteInnerSteps as IncompleteInnerStep[];
    const missingSectionIds = endStep ? endStep.missingSectionIds : [];
    return {
      type: 'incomplete_node',
      missingSectionIds,
      getSection: (missingNextSections: ASTSectionNode[]) => {
        if (missingSectionIds.length != missingNextSections.length) {
          throw new Error(
            'Syntax check error, did not provide the right number of next Sections',
          );
        }
        const completeEndStep = endStep?.getEndStep(missingNextSections);
        let nextStep: ASTStepNode = completeEndStep ?? {
          type: ASTNodeType.End,
        };
        for (const incompleteInnerStep of innerSteps.reverse()) {
          nextStep = incompleteInnerStep.getInnerStep(nextStep);
        }
        return {
          type: ASTNodeType.Section,
          url: section.url,
          start: nextStep,
        };
      },
    };
  }
};

const checkSubsection = (
  subsection: CSTSubsectionNode,
  subsectionType: 'end' | 'inner',
): IncompleteSubsection | SyntaxCheckErrors => {
  let errors: SyntaxCheckError[] = [];

  const incompleteInnerSteps = subsection.innerSteps.map((innerStep) =>
    checkInnerStep(innerStep),
  );

  const innerStepErrors = incompleteInnerSteps.filter(
    (result) => result.type === 'syntax_error',
  );
  if (innerStepErrors.length > 0) {
    errors = [
      ...errors,
      ...innerStepErrors.reduce((prev, current) => ({
        type: 'syntax_error',
        errors: [...prev.errors, ...current.errors],
      })).errors,
    ];
  }

  const incompleteEndStep = subsection.endStep
    ? checkEndStep(subsection.endStep)
    : undefined;

  if (incompleteEndStep && incompleteEndStep.type === 'syntax_error') {
    errors = [...errors, ...incompleteEndStep.errors];
  }

  if (errors.length > 0) {
    return { type: 'syntax_error', errors };
  } else {
    switch (subsectionType) {
      case 'end': {
        const endStep = incompleteEndStep
          ? (incompleteEndStep as IncompleteEndStep)
          : undefined;
        const innerSteps = incompleteInnerSteps as IncompleteInnerStep[];
        const missingSectionIds = endStep ? endStep.missingSectionIds : [];
        return {
          type: 'incomplete_node',
          subsectionType: 'end',
          missingSectionIds,
          getSubsection: (missingNextSections: ASTSectionNode[]) => {
            if (missingSectionIds.length != missingNextSections.length) {
              throw new Error(
                'Syntax check error, did not provide the right number of next Sections',
              );
            }
            const completeEndStep = endStep?.getEndStep(missingNextSections);
            let nextStep: ASTStepNode = completeEndStep ?? {
              type: ASTNodeType.End,
            };
            for (const incompleteInnerStep of innerSteps.reverse()) {
              nextStep = incompleteInnerStep.getInnerStep(nextStep);
            }
            return {
              type: ASTNodeType.Subsection,
              start: nextStep,
            };
          },
        };
      }
      case 'inner': {
        if (!incompleteEndStep) {
          throw new Error('Inner subsection has an end step');
        }
        const innerSteps = incompleteInnerSteps as IncompleteInnerStep[];
        return {
          type: 'incomplete_node',
          subsectionType: 'inner',
          getSubsection: (missingNextStep) => {
            let nextStep = missingNextStep;
            for (const incompleteInnerStep of innerSteps.reverse()) {
              nextStep = incompleteInnerStep.getInnerStep(nextStep);
            }
            return {
              type: ASTNodeType.Subsection,
              start: nextStep,
            };
          },
        };
      }
    }
  }
};

const checkInnerStep = (
  innerStep: CSTInnerStepNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  switch (innerStep.type) {
    case CSTStepNodeType.Click:
      return checkClickNode(innerStep);
    case CSTStepNodeType.Read:
      return checkReadNode(innerStep);
    case CSTStepNodeType.ScrollTo:
      return checkScrollToNode(innerStep);
    case CSTStepNodeType.Drag:
      return checkDragNode(innerStep);
    case CSTStepNodeType.UserDecision:
      return checkUserDecisionInnerNode(innerStep);
    case CSTStepNodeType.Write:
      return checkWriteNode(innerStep);
    case CSTStepNodeType.Select:
      return checkSelectNode(innerStep);
    case CSTStepNodeType.Draw:
      return checkDrawNode(innerStep);
  }
};

const checkEndStep = (
  endStep: CSTEndStepNode,
): IncompleteEndStep | SyntaxCheckErrors => {
  switch (endStep.type) {
    case CSTStepNodeType.Follow:
      return checkFollowNode(endStep);
    case CSTStepNodeType.UserDecision:
      return checkUserDecisionEndNode(endStep);
  }
};

const checkUserDecisionInnerNode = (
  userDecisionNode: CSTUserDecisionInnerStepNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  let errors: SyntaxCheckError[] = !userDecisionNode.question
    ? [{ location: userDecisionNode.id, reason: 'Missing decision question' }]
    : [];
  const incompleteSubsection1 = checkSubsection(
    userDecisionNode.choice1,
    'inner',
  );
  if (incompleteSubsection1.type === 'syntax_error') {
    errors = [...errors, ...incompleteSubsection1.errors];
  }
  const incompleteSubsection2 = checkSubsection(
    userDecisionNode.choice2,
    'inner',
  );
  if (incompleteSubsection2.type === 'syntax_error') {
    errors = [...errors, ...incompleteSubsection2.errors];
  }
  if (errors.length > 0) {
    return { type: 'syntax_error', errors };
  } else {
    const subsection1 = incompleteSubsection1 as IncompleteSubsection;
    const subsection2 = incompleteSubsection2 as IncompleteSubsection;
    if (
      subsection1.subsectionType === 'end' ||
      subsection2.subsectionType === 'end'
    ) {
      throw new Error('Subsections have end type when they should be inner');
    }

    return {
      type: 'incomplete_node',
      getInnerStep: (missingNextStep) => ({
        type: ASTNodeType.UserDecision,
        question: userDecisionNode.question!,
        choice1: subsection1.getSubsection(missingNextStep),
        choice2: subsection2.getSubsection(missingNextStep),
      }),
    };
  }
};

const checkUserDecisionEndNode = (
  userDecisionNode: CSTUserDecisionEndStepNode,
): IncompleteEndStep | SyntaxCheckErrors => {
  let errors: SyntaxCheckError[] = !userDecisionNode.question
    ? [{ location: userDecisionNode.id, reason: 'Missing decision question' }]
    : [];
  const incompleteSubsection1 = checkSubsection(
    userDecisionNode.choice1,
    'end',
  );
  if (incompleteSubsection1.type === 'syntax_error') {
    errors = [...errors, ...incompleteSubsection1.errors];
  }
  const incompleteSubsection2 = checkSubsection(
    userDecisionNode.choice2,
    'end',
  );
  if (incompleteSubsection2.type === 'syntax_error') {
    errors = [...errors, ...incompleteSubsection2.errors];
  }
  if (errors.length > 0) {
    return { type: 'syntax_error', errors };
  } else {
    const subsection1 = incompleteSubsection1 as IncompleteSubsection;
    const subsection2 = incompleteSubsection2 as IncompleteSubsection;
    if (
      subsection1.subsectionType === 'inner' ||
      subsection2.subsectionType === 'inner'
    ) {
      throw new Error('Subsections have inner type when they should be end');
    }

    return {
      type: 'incomplete_node',
      missingSectionIds: [
        ...subsection1.missingSectionIds,
        ...subsection2.missingSectionIds,
      ],
      getEndStep: (missingNextSections) => ({
        type: ASTNodeType.UserDecision,
        question: userDecisionNode.question!,
        choice1: subsection1.getSubsection(
          missingNextSections.slice(0, subsection1.missingSectionIds.length),
        ),
        choice2: subsection2.getSubsection(
          missingNextSections.slice(subsection1.missingSectionIds.length, -1),
        ),
      }),
    };
  }
};

export default checkSyntax;
