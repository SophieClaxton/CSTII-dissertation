import {
  CSTClickNode,
  CSTFollowNode,
  CSTReadNode,
  CSTSectionNode,
  CSTStepNodeType,
  CSTSubsectionNode,
  CSTUserDecisionEndType,
  CSTUserDecisionEndStepNode,
  CSTWriteNode,
  CSTUserDecisionInnerStepNode,
} from '../../models/CST/CST';
import { UnpublishedScript } from '../../models/UnpublishedScript';

const followNode: CSTFollowNode = {
  id: { parentId: { sectionId: 1 }, stepId: 'E' },
  type: CSTStepNodeType.Follow,
  element: { outerHTML: '', tag: 'A', url: 'www.url1.com' },
  nextSectionId: { sectionId: 2 },
};

const readNode: CSTReadNode = {
  id: { parentId: { sectionId: 1 }, stepId: 1 },
  type: CSTStepNodeType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url1.com' },
};

const clickNode: CSTClickNode = {
  id: {
    parentId: {
      parentId: { parentId: { sectionId: 1 }, stepId: 2 },
      subsectionId: 1,
    },
    stepId: 1,
  },
  type: CSTStepNodeType.Click,
  element: { outerHTML: '', tag: 'BUTTON', url: 'www.url1.com' },
};

const writeNode: CSTWriteNode = {
  id: {
    parentId: {
      parentId: { parentId: { sectionId: 1 }, stepId: 2 },
      subsectionId: 2,
    },
    stepId: 1,
  },
  type: CSTStepNodeType.Write,
  element: { outerHTML: '', tag: 'INPUT', url: 'www.url1.com' },
};

const subsection1: CSTSubsectionNode = {
  id: { parentId: { parentId: { sectionId: 1 }, stepId: 2 }, subsectionId: 1 },
  answer: 'yes',
  innerSteps: [clickNode],
  endStep: undefined,
};

const subsection2: CSTSubsectionNode = {
  id: { parentId: { parentId: { sectionId: 1 }, stepId: 2 }, subsectionId: 2 },
  answer: 'no',
  innerSteps: [writeNode],
  endStep: undefined,
};

const decisionNode: CSTUserDecisionInnerStepNode = {
  id: { parentId: { sectionId: 1 }, stepId: 2 },
  type: CSTStepNodeType.UserDecision,
  question: 'Are you older than 20?',
  choice1: subsection1,
  choice2: subsection2,
  endsWithFollow: CSTUserDecisionEndType.InnerStep,
};

const section1: CSTSectionNode = {
  id: { sectionId: 1 },
  url: 'www.url1.com',
  innerSteps: [readNode, decisionNode],
  endStep: followNode,
};

const readNode2: CSTReadNode = {
  id: { parentId: { sectionId: 2 }, stepId: 1 },
  type: CSTStepNodeType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url2.com' },
};

const followNodeSub21: CSTFollowNode = {
  id: {
    parentId: {
      parentId: { parentId: { sectionId: 2 }, stepId: 'E' },
      subsectionId: 1,
    },
    stepId: 'E',
  },
  type: CSTStepNodeType.Follow,
  element: { outerHTML: '', tag: 'P', url: 'www.url3.com' },
  nextSectionId: { sectionId: 3 },
};

const followNodeSub22: CSTFollowNode = {
  id: {
    parentId: {
      parentId: { parentId: { sectionId: 2 }, stepId: 'E' },
      subsectionId: 2,
    },
    stepId: 'E',
  },
  type: CSTStepNodeType.Follow,
  nextSectionId: undefined,
};

const subsection12: CSTSubsectionNode = {
  id: {
    parentId: { parentId: { sectionId: 2 }, stepId: 'E' },
    subsectionId: 1,
  },
  answer: 'yes',
  innerSteps: [],
  endStep: followNodeSub21,
};

const subsection22: CSTSubsectionNode = {
  id: {
    parentId: { parentId: { sectionId: 2 }, stepId: 'E' },
    subsectionId: 2,
  },
  answer: 'no',
  innerSteps: [],
  endStep: followNodeSub22,
};

const userDecision2: CSTUserDecisionEndStepNode = {
  id: { parentId: { sectionId: 2 }, stepId: 'E' },
  type: CSTStepNodeType.UserDecision,
  question: 'Are you hungry?',
  choice1: subsection12,
  choice2: subsection22,
  endsWithFollow: CSTUserDecisionEndType.Follow,
};

const section2: CSTSectionNode = {
  id: { sectionId: 2 },
  url: 'www.url2.com',
  innerSteps: [readNode2],
  endStep: userDecision2,
};

const section3: CSTSectionNode = {
  id: { sectionId: 3 },
  url: 'www.url3.com',
  innerSteps: [],
  endStep: undefined,
};

const testUnpublishedScript: UnpublishedScript = {
  id: 1,
  title: 'Test Program',
  author: { id: 1, name: 'Sophie' },
  created_at: '2025-01-09T15:47:54.506677',
  program: { sections: [section1, section2, section3] },
};

export default testUnpublishedScript;
