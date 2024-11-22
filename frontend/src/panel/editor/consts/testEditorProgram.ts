import {
  EditorClickStep,
  EditorFollowStep,
  EditorProgram,
  EditorReadStep,
  EditorSection,
  EditorStepType,
  EditorSubsection,
  EditorUserDecisionStep,
  EditorWriteStep,
} from '../../models/ProgramComponent';

const followNode: EditorFollowStep = {
  id: 5,
  type: EditorStepType.Follow,
  element: { outerHTML: '', tag: 'A', url: 'www.url1.com' },
  nextSectionId: '2',
  parentSectionId: '1',
};

const readNode: EditorReadStep = {
  id: 1,
  type: EditorStepType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url1.com' },
};

const clickNode: EditorClickStep = {
  id: 3,
  type: EditorStepType.Click,
  element: { outerHTML: '', tag: 'BUTTON', url: 'www.url1.com' },
};

const writeNode: EditorWriteStep = {
  id: 4,
  type: EditorStepType.Write,
  element: { outerHTML: '', tag: 'INPUT', url: 'www.url1.com' },
};

const subsection1: EditorSubsection = {
  id: '3',
  answer: 'yes',
  innerSteps: [clickNode],
  endStep: undefined,
};

const subsection2: EditorSubsection = {
  id: '4',
  answer: 'no',
  innerSteps: [writeNode],
  endStep: undefined,
};

const decisionNode: EditorUserDecisionStep = {
  id: 2,
  type: EditorStepType.UserDecision,
  question: 'Are you older than 20?',
  choice1: subsection1,
  choice2: subsection2,
};

const section1: EditorSection = {
  id: '1',
  url: 'www.url1.com',
  innerSteps: [readNode, decisionNode],
  endStep: followNode,
};

const readNode2: EditorReadStep = {
  id: 1,
  type: EditorStepType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url2.com' },
};

const followNodeSub21: EditorFollowStep = {
  id: 3,
  type: EditorStepType.Follow,
  element: { outerHTML: '', tag: 'P', url: 'www.url3.com' },
  nextSectionId: '3',
  parentSectionId: '2S1',
};

const followNodeSub22: EditorFollowStep = {
  id: 4,
  type: EditorStepType.Follow,
  element: { outerHTML: '', tag: 'P', url: 'www.url4.com' },
  nextSectionId: '4',
  parentSectionId: '2S2',
};

const subsection12: EditorSubsection = {
  id: '2S1',
  answer: 'yes',
  innerSteps: [],
  endStep: followNodeSub21,
};

const subsection22: EditorSubsection = {
  id: '2S2',
  answer: 'no',
  innerSteps: [],
  endStep: followNodeSub22,
};

const userDecision2: EditorUserDecisionStep = {
  id: 2,
  type: EditorStepType.UserDecision,
  question: 'Are you hungry?',
  choice1: subsection12,
  choice2: subsection22,
};

const section2: EditorSection = {
  id: '2',
  url: 'www.url2.com',
  innerSteps: [readNode2, userDecision2],
  endStep: undefined,
};

const section3: EditorSection = {
  id: '3',
  url: 'www.url3.com',
  innerSteps: [],
  endStep: undefined,
};

const section4: EditorSection = {
  id: '4',
  url: 'www.url4.com',
  innerSteps: [],
  endStep: undefined,
};

const testEditorProgram: EditorProgram = {
  name: 'Test Program',
  author: 'Sophie',
  dateCreated: '20/11/2024',
  sections: [section1, section2, section3, section4],
};

export default testEditorProgram;
