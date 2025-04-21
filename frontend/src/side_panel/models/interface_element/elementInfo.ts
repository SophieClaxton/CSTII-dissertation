import { SelectableTag } from './selectableTag';
import { Option } from './InterfaceElement';

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

const getOptionsFromOuterHTML = (outerHTML: string): Option[] => {
  const optionsRegex = /value="([\w\d]*)">([\w\s\d]*)</g;
  const matches = outerHTML.matchAll(optionsRegex);
  return Array.from(matches, (match) => ({ value: match[1], text: match[2] }));
};

export { mapTagToElementName, elementTypeIs, getOptionsFromOuterHTML };
