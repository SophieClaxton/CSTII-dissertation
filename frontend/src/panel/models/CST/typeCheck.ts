import { mapIdToString } from '../../unpublishedScriptReducer/mappers/nodeIds';
import {
  ASTCheckNode,
  ASTClickNode,
  ASTDragNode,
  ASTDrawNode,
  ASTNodeType,
  ASTProgram,
  ASTReadNode,
  ASTScrollToNode,
  ASTSection,
  ASTSectionNode,
  ASTSelectNode,
  ASTStepNode,
  ASTSubsectionNode,
  ASTWriteNode,
} from '../AST/AST';
import {
  astCheckNodeSchema,
  astDragNodeSchema,
  astDrawNodeSchema,
  astSelectNodeSchema,
  astStepBaseSchema,
  astWriteNodeSchema,
} from '../AST/schemas';
import {
  isASTSectionNode,
  isASTStepNode,
  isASTSubsectionNode,
} from '../AST/testers';
import { getMissingProperties, Schema } from '../Schema';
import {
  CSTCheckNode,
  CSTClickNode,
  CSTDragNode,
  CSTDrawNode,
  CSTEndStepNode,
  CSTFollowNode,
  CSTInnerStepNode,
  CSTNodeId,
  CSTProgram,
  CSTReadNode,
  CSTScrollToNode,
  CSTSection,
  CSTSectionNode,
  CSTSelectNode,
  CSTStepNodeType,
  CSTSubsectionNode,
  CSTUserDecisionEndStepNode,
  CSTWriteNode,
} from './CST';
import { isSection } from './testers';

type TypeCheckResult =
  | { success: true; program: ASTProgram }
  | { success: false; errors: TypeCheckError[] };

interface TypeCheckError {
  location: CSTNodeId;
  reason: string;
}

const typeCheck = (program: CSTProgram): TypeCheckResult => {
  // Require sections to be sorted topologically
  const sections = [...program.sections].reverse();
  // take a copy to avoid mutating the original program

  const mappedSections = new Map<string, ASTSectionNode | TypeCheckError[]>();

  for (const section of sections) {
    const mappedSection = mapSection<CSTSectionNode, ASTSectionNode>(
      section,
      ASTNodeType.Section,
      mappedSections,
    );
    mappedSections.set(mapIdToString(section.id), mappedSection);
  }

  const firstSection = mappedSections.get(
    mapIdToString(program.sections[0].id),
  );
  return firstSection
    ? isASTSectionNode(firstSection)
      ? { success: true, program: { start: firstSection } }
      : { success: false, errors: firstSection }
    : {
        success: false,
        errors: [{ location: { sectionId: 0 }, reason: 'Missing section 1' }],
      };
};

const getEndStep = (
  endStep: CSTEndStepNode | undefined,
  mappedSections: Map<string, ASTSectionNode | TypeCheckError[]>,
): ASTStepNode | TypeCheckError[] => {
  switch (endStep?.type) {
    case undefined:
      return { type: ASTNodeType.End };
    case CSTStepNodeType.Follow: {
      const nextSectionId = endStep.nextSectionId;
      const nextSection = nextSectionId
        ? mappedSections.get(mapIdToString(nextSectionId))
        : undefined;
      return mapFollowStep(endStep, nextSection);
    }
    case CSTStepNodeType.UserDecision: {
      const nextSection1 = mapSection<CSTSubsectionNode, ASTSubsectionNode>(
        endStep.choice1,
        ASTNodeType.Subsection,
        mappedSections,
      );
      const nextSection2 = mapSection<CSTSubsectionNode, ASTSubsectionNode>(
        endStep.choice2,
        ASTNodeType.Subsection,
        mappedSections,
      );
      return mapUserDecisionStep(endStep, nextSection1, nextSection2);
    }
  }
};

const mapSection = <I extends CSTSection, O extends ASTSection>(
  section: I,
  sectionType: ASTNodeType,
  mappedSections: Map<string, ASTSectionNode | TypeCheckError[]>,
): O | TypeCheckError[] => {
  let nextStep: ASTStepNode | TypeCheckError[] = getEndStep(
    section.endStep,
    mappedSections,
  );

  const innerSteps = [...section.innerSteps].reverse();
  for (const innerStep of innerSteps) {
    if (!isASTStepNode(nextStep)) {
      break;
    }
    nextStep = mapInnerStep(innerStep, nextStep);
  }

  if (isSection(section)) {
    const hasUrl = section.url.length > 0;
    return isASTStepNode(nextStep) && hasUrl
      ? ({ type: sectionType, start: nextStep, url: section.url } as O)
      : [
          ...(isASTStepNode(nextStep) ? [] : nextStep),
          ...(hasUrl ? [] : [{ location: section.id, reason: 'Missing url' }]),
        ];
  } else {
    return isASTStepNode(nextStep)
      ? ({ type: sectionType, start: nextStep } as O)
      : nextStep;
  }
};

const mapStepNode = <I extends CSTInnerStepNode, R extends ASTStepNode>(
  node: I,
  next: ASTStepNode | TypeCheckError[],
  schema: Schema<R>,
): R | TypeCheckError[] => {
  const missingProperties = getMissingProperties(node, schema);

  if (missingProperties.length > 0) {
    const nodeError = {
      location: node.id,
      reason: missingProperties
        .map((property) => `Missing ${property}`)
        .join(', '),
    };
    if (isASTStepNode(next)) {
      return [nodeError];
    }
    return [nodeError, ...next];
  }

  if (isASTStepNode(next)) {
    const objectEntries = Object.keys(schema).map((key: string) => [
      key,
      node[key as keyof I],
    ]);
    return { ...Object.fromEntries(objectEntries), next } as R;
  }
  console.log(next);
  return next;
};

const mapInnerStep = (
  innerStep: CSTInnerStepNode,
  next: ASTStepNode | TypeCheckError[],
): ASTStepNode | TypeCheckError[] => {
  switch (innerStep.type) {
    case CSTStepNodeType.Click:
      return mapStepNode<CSTClickNode, ASTClickNode>(
        innerStep,
        next,
        astStepBaseSchema,
      );
    case CSTStepNodeType.Read:
      return mapStepNode<CSTReadNode, ASTReadNode>(
        innerStep,
        next,
        astStepBaseSchema,
      );
    case CSTStepNodeType.ScrollTo:
      return mapStepNode<CSTScrollToNode, ASTScrollToNode>(
        innerStep,
        next,
        astStepBaseSchema,
      );
    case CSTStepNodeType.Drag:
      return mapStepNode<CSTDragNode, ASTDragNode>(
        innerStep,
        next,
        astDragNodeSchema,
      );
    case CSTStepNodeType.UserDecision: {
      // May need to restrict user decisions to being end steps
      const error = {
        location: innerStep.id,
        reason: 'Inner step User Decision not allowed',
      };
      if (isASTStepNode(next)) {
        return [error];
      } else {
        return [error, ...next];
      }
    }
    case CSTStepNodeType.Write:
      return mapStepNode<CSTWriteNode, ASTWriteNode>(
        innerStep,
        next,
        astWriteNodeSchema,
      );
    case CSTStepNodeType.Select:
      return mapStepNode<CSTSelectNode, ASTSelectNode>(
        innerStep,
        next,
        astSelectNodeSchema,
      );
    case CSTStepNodeType.Check:
      return mapStepNode<CSTCheckNode, ASTCheckNode>(
        innerStep,
        next,
        astCheckNodeSchema,
      );
    case CSTStepNodeType.Draw:
      return mapStepNode<CSTDrawNode, ASTDrawNode>(
        innerStep,
        next,
        astDrawNodeSchema,
      );
  }
};

const mapFollowStep = (
  endStep: CSTFollowNode,
  nextSection: ASTSectionNode | TypeCheckError[] | undefined,
): ASTStepNode | TypeCheckError[] => {
  if (endStep.element) {
    if (nextSection) {
      if (isASTSectionNode(nextSection)) {
        return {
          type: ASTNodeType.Follow,
          element: endStep.element,
          nextSection: nextSection,
        };
      }
      return nextSection;
    }
    return [{ location: endStep.id, reason: 'Missing next section' }];
  }

  const endStepError = { location: endStep.id, reason: 'Missing element' };
  if (nextSection) {
    if (isASTSectionNode(nextSection)) {
      return [endStepError];
    }
    return [endStepError, ...nextSection];
  }
  endStepError.reason = 'Missing element, Missing next section';
  return [endStepError];
};

const mapUserDecisionStep = (
  endStep: CSTUserDecisionEndStepNode,
  nextSection1: ASTSubsectionNode | TypeCheckError[],
  nextSection2: ASTSubsectionNode | TypeCheckError[],
): ASTStepNode | TypeCheckError[] => {
  if (endStep.question) {
    if (
      isASTSubsectionNode(nextSection1) &&
      isASTSubsectionNode(nextSection2)
    ) {
      return {
        type: ASTNodeType.UserDecision,
        question: endStep.question,
        choice1: nextSection1,
        choice2: nextSection2,
      };
    }
    return [
      ...(isASTSubsectionNode(nextSection1) ? [] : nextSection1),
      ...(isASTSubsectionNode(nextSection2) ? [] : nextSection2),
    ];
  }
  const endStepError = { location: endStep.id, reason: 'Missing question' };
  return [
    endStepError,
    ...(isASTSubsectionNode(nextSection1) ? [] : nextSection1),
    ...(isASTSubsectionNode(nextSection2) ? [] : nextSection2),
  ];
};

export default typeCheck;
export type { TypeCheckError, TypeCheckResult };
