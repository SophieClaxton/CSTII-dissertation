import {
  CSTProgram,
  CSTSectionNode,
  CSTStepNodeType,
  CSTWriteNode,
} from '../../panel/models/CST/CST';
import { EditorActionType } from '../../panel/models/EditorAction';
import {
  addInputDescriptionToInput,
  editInputStepInputDescription,
} from '../../panel/scripting_interface/unpublished_script_reducer/innerStepActions';

const writeStep: CSTWriteNode = {
  element: {
    outerHTML:
      '<input enterkeyhint="search" class="gem-c-search__…" name="q" title="Search" type="search" value="">',
    url: 'https://www.gov.uk/guidance/the-highway-code',
    tag: 'INPUT',
    textContent: '',
  },
  id: { parentId: { sectionId: 1 }, stepId: 1 },
  type: CSTStepNodeType.Write,
  isExact: true,
};

describe('addInputDescriptionToInput', () => {
  it('adds text and isExact to a Write step', () => {
    const newStep = addInputDescriptionToInput(writeStep, 'hi', true);
    const newWriteStep = newStep as CSTWriteNode;
    expect(newWriteStep.text).toBe('hi');
    expect(newWriteStep.isExact).toBe(true);
  });
});

describe('editInputStepInputDescription', () => {
  it('correctly updates write step', () => {
    const section: CSTSectionNode = {
      id: { sectionId: 1 },
      url: 'www.me.com',
      innerSteps: [writeStep],
      endStep: undefined,
    };
    const program: CSTProgram = {
      sections: [section],
    };
    const newProgram = editInputStepInputDescription(program, {
      type: EditorActionType.EditInputStepDescription,
      stepId: { parentId: { sectionId: 1 }, stepId: 1 },
      description: 'hi',
      isExact: true,
    });
    const newWriteStep = newProgram.sections.at(0)?.innerSteps.at(0);
    expect(newWriteStep).toBeDefined();
    expect((newWriteStep as CSTWriteNode).text).toBe('hi');
    expect((newWriteStep as CSTWriteNode).isExact).toBe(true);
  });
});
