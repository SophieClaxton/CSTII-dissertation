import {
  EditorClickStep,
  EditorFollowStep,
  EditorProgram,
  EditorReadStep,
  EditorSection,
  EditorStepName,
  EditorSubsection,
  EditorUserDecisionStep,
  EditorWriteStep,
} from '../../models/ProgramComponent';

const followNode: EditorFollowStep = {
  name: EditorStepName.Follow,
  element: { outerHTML: '', tag: 'A', url: 'www.url1.com' },
  nextSectionId: 2,
};

const readNode: EditorReadStep = {
  name: EditorStepName.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url1.com' },
};

const clickNode: EditorClickStep = {
  name: EditorStepName.Click,
  element: { outerHTML: '', tag: 'BUTTON', url: 'www.url1.com' },
};

const writeNode: EditorWriteStep = {
  name: EditorStepName.Write,
  element: { outerHTML: '', tag: 'INPUT', url: 'www.url1.com' },
};

const readNode2: EditorReadStep = {
  name: EditorStepName.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url2.com' },
};

const subsection1: EditorSubsection = {
  id: 3,
  innerSteps: [clickNode],
  endStep: undefined,
};

const subsection2: EditorSubsection = {
  id: 3,
  innerSteps: [writeNode],
  endStep: undefined,
};

const decisionNode: EditorUserDecisionStep = {
  name: EditorStepName.UserDecision,
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
