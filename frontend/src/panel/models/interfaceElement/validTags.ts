import { CSTElementNode } from '../CST/CST';
import { elementTypeIs } from './elementInfo';
import { defaultSelectableTags, SelectableTag } from './selectableTag';

interface ValidTag {
  tag: SelectableTag;
  condition?: (element: Element) => boolean;
}

const defaultValidTags: ValidTag[] = [...defaultSelectableTags].map((tag) => ({
  tag,
}));

const mapStepNodeToValidTags: Record<CSTElementNode['type'], ValidTag[]> = {
  'Go To': [
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
  Select: [
    { tag: 'SELECT' },
    { tag: 'INPUT', condition: elementTypeIs('checkbox') },
    { tag: 'INPUT', condition: elementTypeIs('radio') },
  ],
  Draw: [{ tag: 'CANVAS' }],
};

export type { ValidTag };
export { mapStepNodeToValidTags };
