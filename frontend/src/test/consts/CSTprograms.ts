import { CSTProgram } from '../../panel/models/CST/CST';

const emptyProgram: CSTProgram = {
  sections: [
    {
      id: { sectionId: 1 },
      url: 'www.test.com',
      innerSteps: [],
    },
  ],
};

const allCSTPrograms: {
  name: string;
  program: CSTProgram;
  expectedSuccess: boolean;
}[] = [{ name: 'Empty Program', program: emptyProgram, expectedSuccess: true }];

export { allCSTPrograms, emptyProgram };
