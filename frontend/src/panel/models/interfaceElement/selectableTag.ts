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
const allInputTags = ['INPUT', 'TEXTAREA', 'SELECT'] as const;

const allSelectableTags = [
  'A',
  'BUTTON',
  'CANVAS',
  'FORM',
  ...defaultSelectableTags,
  ...allInputTags,
] as const;

type SelectableTag = (typeof allSelectableTags)[number];

function isSelectableTag(tagName: string): tagName is SelectableTag {
  const tag = allSelectableTags.find((tag) => tag === tagName);
  return tag ? true : false;
}

export type { SelectableTag };
export {
  defaultSelectableTags,
  allSelectableTags,
  allInputTags,
  isSelectableTag,
};
