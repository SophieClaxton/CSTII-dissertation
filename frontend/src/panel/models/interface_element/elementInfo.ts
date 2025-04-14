import { SelectableTag } from './selectableTag';

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
  OL: 'Numbered List',
  UL: 'Bulleted List',
};

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

export { mapTagToElementName, elementTypeIs };
