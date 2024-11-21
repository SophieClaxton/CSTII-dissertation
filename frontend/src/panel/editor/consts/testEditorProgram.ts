import {
  EditorClickStep,
  EditorFollowStep,
  EditorProgram,
  EditorReadStep,
  EditorSection,
  EditorStepType,
  EditorSubsection,
  EditorUserDecisionEndsWithType,
  EditorUserDecisionEndStep,
  EditorUserDecisionStep,
  EditorWriteStep,
} from '../../models/programComponent/ProgramComponent';

const followNode: EditorFollowStep = {
  id: 'S1.E',
  type: EditorStepType.Follow,
  element: { outerHTML: '', tag: 'A', url: 'www.url1.com' },
  nextSectionId: 'S2',
  parentSectionId: 'S1',
};

const readNode: EditorReadStep = {
  id: 'S1.1',
  type: EditorStepType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url1.com' },
};

const clickNode: EditorClickStep = {
  id: 'S1.2.s1.1',
  type: EditorStepType.Click,
  element: { outerHTML: '', tag: 'BUTTON', url: 'www.url1.com' },
};

const writeNode: EditorWriteStep = {
  id: 'S1.2.s2.1',
  type: EditorStepType.Write,
  element: { outerHTML: '', tag: 'INPUT', url: 'www.url1.com' },
};

const subsection1: EditorSubsection = {
  id: 'S1.2.s1',
  answer: 'yes',
  innerSteps: [clickNode],
  endStep: undefined,
};

const subsection2: EditorSubsection = {
  id: 'S1.2.s2',
  answer: 'no',
  innerSteps: [writeNode],
  endStep: undefined,
};

const decisionNode: EditorUserDecisionStep = {
  id: 'S1.2',
  type: EditorStepType.UserDecision,
  question: 'Are you older than 20?',
  choice1: subsection1,
  choice2: subsection2,
  endsWithFollow: EditorUserDecisionEndsWithType.InnerStep,
};

const section1: EditorSection = {
  id: 'S1',
  url: 'www.url1.com',
  innerSteps: [readNode, decisionNode],
  endStep: followNode,
};

const readNode2: EditorReadStep = {
  id: 'S2.1',
  type: EditorStepType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url2.com' },
};

const followNodeSub21: EditorFollowStep = {
  id: 'S2.E.s1.E',
  type: EditorStepType.Follow,
  element: { outerHTML: '', tag: 'P', url: 'www.url3.com' },
  nextSectionId: 'S3',
  parentSectionId: 'S1.E.s1',
};

const followNodeSub22: EditorFollowStep = {
  id: 'S2.E.s2.E',
  type: EditorStepType.Follow,
  parentSectionId: 'S1.E.s2',
  nextSectionId: undefined,
};

const subsection12: EditorSubsection = {
  id: 'S2.E.s1',
  answer: 'yes',
  innerSteps: [],
  endStep: followNodeSub21,
};

const subsection22: EditorSubsection = {
  id: 'S2.E.s2',
  answer: 'no',
  innerSteps: [],
  endStep: followNodeSub22,
};

const userDecision2: EditorUserDecisionEndStep = {
  id: 'S2.E',
  type: EditorStepType.UserDecision,
  question: 'Are you hungry?',
  choice1: subsection12,
  choice2: subsection22,
  endsWithFollow: EditorUserDecisionEndsWithType.Follow,
};

const section2: EditorSection = {
  id: 'S2',
  url: 'www.url2.com',
  innerSteps: [readNode2],
  endStep: userDecision2,
};

const section3: EditorSection = {
  id: 'S3',
  url: 'www.url3.com',
  innerSteps: [],
  endStep: undefined,
};

const testEditorProgram: EditorProgram = {
  name: 'Test Program',
  author: 'Sophie',
  dateCreated: '20/11/2024',
  sections: [section1, section2, section3],
};

export default testEditorProgram;
