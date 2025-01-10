import { CSTProgram, CSTStepNodeType } from '../../../panel/models/CST/CST';

const emptyProgram: CSTProgram = {
  sections: [
    {
      id: { sectionId: 1 },
      url: 'www.test.com',
      innerSteps: [],
    },
  ],
};

const smallMissingElement: CSTProgram = {
  sections: [
    {
      id: { sectionId: 1 },
      url: 'www.test.com',
      innerSteps: [
        {
          id: { parentId: { sectionId: 1 }, stepId: 1 },
          type: CSTStepNodeType.Click,
        },
      ],
    },
  ],
};

const allCSTPrograms: {
  name: string;
  program: CSTProgram;
  expectedSuccess: boolean;
}[] = [
  { name: 'Empty Program', program: emptyProgram, expectedSuccess: true },
  {
    name: 'Small Program with Missing Element',
    program: smallMissingElement,
    expectedSuccess: false,
  },
];

export { allCSTPrograms, emptyProgram };
