import { elementTypeIs } from './elementInfo';
import { SelectableTag } from './selectableTag';

interface ValidAttribute {
  attr: string;
  condition?: (element: Element) => boolean;
}

const commonAttr: ValidAttribute[] = [
  { attr: 'aria-label' },
  { attr: 'aria-description' },
  { attr: 'aria-roledescription' },
  { attr: 'draggable' },
  { attr: 'hidden' },
  { attr: 'inert' },
  { attr: 'inputmode' },
  { attr: 'popover' },
  { attr: 'title' },
];

const mapTagToRelevantAttributes: Record<SelectableTag, ValidAttribute[]> = {
  A: [
    { attr: 'href' },
    { attr: 'rel' },
    { attr: 'target' },
    { attr: 'download' },
  ],
  BUTTON: [
    { attr: 'name' },
    { attr: 'form' },
    { attr: 'type' },
    { attr: 'value' },
  ],
  CANVAS: [],
  FORM: [
    { attr: 'name' },
    { attr: 'method' },
    { attr: 'action' },
    { attr: 'rel' },
    { attr: 'target' },
  ],
  IMG: [{ attr: 'alt' }, { attr: 'src' }, { attr: 'srcset' }],
  P: [],
  H1: [],
  H2: [],
  H3: [],
  H4: [],
  H5: [],
  H6: [],
  CAPTION: [],
  CODE: [],
  LABEL: [{ attr: 'form' }, { attr: 'for' }],
  LEGEND: [],
  TABLE: [],
  VIDEO: [],
  INPUT: [
    { attr: 'type' },
    { attr: 'name' },
    { attr: 'value', condition: elementTypeIs(['checkbox', 'radio']) },
    { attr: 'form' },
    { attr: 'pattern' },
    { attr: 'multiple' },
    { attr: 'readonly' },
    { attr: 'alt' },
  ],
  TEXTAREA: [{ attr: 'name' }, { attr: 'form' }, { attr: 'readonly' }],
  SELECT: [{ attr: 'name' }, { attr: 'form' }, { attr: 'multiple' }],
  OL: [],
  UL: [],
};

export type { ValidAttribute };
export { mapTagToRelevantAttributes, commonAttr };
