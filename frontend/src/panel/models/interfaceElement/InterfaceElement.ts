import { SelectableTag } from './selectableTag';

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

export default InterfaceElement;
export type { Option };
