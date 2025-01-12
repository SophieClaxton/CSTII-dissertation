import { getNextInnerStepId } from '../../unpublishedScriptReducer/getters/nodeIds';
import {
  CSTEndStepId,
  CSTEndStepNode,
  CSTInnerStepNode,
  CSTSectionNode,
  CSTStepNode,
  CSTStepNodeType,
  CSTSubsectionNode,
  CSTUserDecisionEndType,
} from './CST';

const getNodeChoices = (
  section: CSTSectionNode | CSTSubsectionNode,
): CSTStepNode[] => {
  const innerNodeChoices = getInnerStepNodeChoices(section);
  return section.endStep
    ? innerNodeChoices
    : [...getEndStepNodeChoices(section), ...innerNodeChoices];
};

const getInnerStepNodeChoices = (
  section: CSTSectionNode | CSTSubsectionNode,
): CSTInnerStepNode[] => [
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.Click,
  },
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.Read,
  },
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.ScrollTo,
  },
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.Drag,
  },
];

const getEndStepNodeChoices = (
  section: CSTSectionNode | CSTSubsectionNode,
): CSTEndStepNode[] => {
  const nodeId: CSTEndStepId = { parentId: section.id, stepId: 'E' };
  return [
    {
      id: nodeId,
      type: CSTStepNodeType.Follow,
    },
    {
      id: nodeId,
      type: CSTStepNodeType.UserDecision,
      endsWithFollow: CSTUserDecisionEndType.Follow,
      choice1: {
        id: { parentId: nodeId, subsectionId: 1 },
        innerSteps: [],
        answer: 'yes',
      },
      choice2: {
        id: { parentId: nodeId, subsectionId: 2 },
        innerSteps: [],
        answer: 'no',
      },
    },
  ];
};

export { getNodeChoices };
