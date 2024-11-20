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
  type: EditorStepType.Follow,
  element: { outerHTML: '', tag: 'A', url: 'www.url1.com' },
  nextSectionId: 2,
};

const readNode: EditorReadStep = {
  type: EditorStepType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url1.com' },
};

const clickNode: EditorClickStep = {
  type: EditorStepType.Click,
  element: { outerHTML: '', tag: 'BUTTON', url: 'www.url1.com' },
};

const writeNode: EditorWriteStep = {
  type: EditorStepType.Write,
  element: { outerHTML: '', tag: 'INPUT', url: 'www.url1.com' },
};

const readNode2: EditorReadStep = {
  type: EditorStepType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url2.com' },
};

const subsection1: EditorSubsection = {
  id: 3,
  answer: 'yes',
  innerSteps: [clickNode],
  endStep: undefined,
};

const subsection2: EditorSubsection = {
  id: 3,
  answer: 'no',
  innerSteps: [writeNode],
  endStep: undefined,
};

const decisionNode: EditorUserDecisionStep = {
  type: EditorStepType.UserDecision,
  question: 'Are you older than 20?',
  choice1: subsection1,
  choice2: subsection2,
};

const section1: EditorSection = {
  id: 1,
  url: 'www.url1.com',
  innerSteps: [readNode, decisionNode],
  endStep: followNode,
};

const section2: EditorSection = {
  id: 2,
  url: 'www.url2.com',
  innerSteps: [readNode2],
  endStep: undefined,
};

const testEditorProgram: EditorProgram = {
  name: 'Test Program',
  author: 'Sophie',
  dateCreated: '20/11/2024',
  sections: [section1, section2],
};

export default testEditorProgram;
