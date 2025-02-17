import { CSTElementNode } from './CST/CST';

interface InterfaceElement {
  outerHTML: string;
  textContent?: string;
  url: string;
  tag: SelectableTag;
  label?: string;
}

interface Option {
  value: string;
  text: string;
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

const defaultValidTags: ValidTag[] = [...defaultSelectableTags].map((tag) => ({
  tag,
}));

const elementTypeIs =
  (type: string | string[], equal: boolean = true) =>
  (element: Element) => {
    if (equal) {
      if (Array.isArray(type)) {
        return type.includes(element.getAttribute('type') ?? '');
      }
      return element.getAttribute('type') === type;
    }
    if (Array.isArray(type)) {
      return !type.includes(element.getAttribute('type') ?? '');
    }
    return element.getAttribute('type') != type;
  };

interface ValidTag {
  tag: SelectableTag;
  condition?: (element: Element) => boolean;
}

const mapStepNodeToValidTags: Record<CSTElementNode['type'], ValidTag[]> = {
  Follow: [
    { tag: 'A' },
    {
      tag: 'BUTTON',
      condition: elementTypeIs('submit'),
    },
  ],
  Click: [
    {
      tag: 'BUTTON',
      condition: elementTypeIs('submit', false),
    },
    {
      tag: 'INPUT',
      condition: elementTypeIs('button'),
    },
  ],
  Read: defaultValidTags,
  'Scroll To': [...defaultValidTags, { tag: 'FORM' }],
  Drag: [],
  Write: [
    {
      tag: 'INPUT',
      condition: elementTypeIs([
        'text',
        'email',
        'number',
        'password',
        'search',
        'tel',
        'url',
        'date',
        'datetime-local',
        'month',
        'time',
        'week',
      ]),
    },
    { tag: 'TEXTAREA' },
  ],
  Select: [{ tag: 'SELECT' }],
  Check: [{ tag: 'INPUT', condition: elementTypeIs('checkbox') }],
  Draw: [{ tag: 'CANVAS' }],
};

export default InterfaceElement;
export type { Option, SelectableTag, ValidTag };
export {
  isSelectableTag,
  defaultSelectableTags,
  allSelectableTags,
  mapTagToElementName,
  mapStepNodeToValidTags,
};
