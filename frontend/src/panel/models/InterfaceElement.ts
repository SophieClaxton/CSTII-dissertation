import { CSTElementNode } from './CST/CST';

interface InterfaceElement {
  outerHTML: string;
  textContent?: string;
  url: string;
  tag: SelectableTag;
}

const defaultSelectableTags = [
  'IMG',
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'CAPTION',
  'CODE',
  'LABEL',
  'LEGEND',
  'TABLE',
  'VIDEO',
] as const;

const allSelectableTags = [
  'A',
  'BUTTON',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'CANVAS',
  'FORM',
  ...defaultSelectableTags,
] as const;

type SelectableTag = (typeof allSelectableTags)[number];

function isSelectableTag(tagName: string): tagName is SelectableTag {
  const tag = allSelectableTags.find((tag) => tag === tagName);
  return tag ? true : false;
}

const mapTagToElementName: Record<SelectableTag, string> = {
  A: 'Link',
  IMG: 'Image',
  BUTTON: 'Button',
  INPUT: 'Input',
  TEXTAREA: 'Input',
  P: 'Paragraph',
  H1: 'Heading',
  H2: 'Heading',
  H3: 'Heading',
  H4: 'Heading',
  H5: 'Heading',
  H6: 'Heading',
  LABEL: 'Label',
  LEGEND: 'Caption',
  CAPTION: 'Caption',
  CODE: 'Code',
  CANVAS: 'Canvas',
  FORM: 'Form',
  TABLE: 'Table',
  VIDEO: 'Video',
  SELECT: 'Selection',
};

const mapStepNodeToValidTags: Record<CSTElementNode['type'], SelectableTag[]> =
  {
    Follow: ['A'],
    Click: ['BUTTON'],
    Read: [...defaultSelectableTags],
    'Scroll To': [...defaultSelectableTags, 'FORM'],
    Drag: [],
    Write: ['INPUT', 'TEXTAREA'],
    Select: ['SELECT'],
    Check: ['INPUT'],
    Draw: ['CANVAS'],
  };

export default InterfaceElement;
export type { SelectableTag };
export {
  isSelectableTag,
  defaultSelectableTags,
  allSelectableTags,
  mapTagToElementName,
  mapStepNodeToValidTags,
};
