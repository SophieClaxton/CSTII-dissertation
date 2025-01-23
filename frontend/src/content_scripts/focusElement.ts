import { elementsMatch } from './elementUtils';

const onSetFocus = (
  tag: string,
  outerHTML: string,
  highlight: boolean = true,
): boolean => {
  const idPattern = /id="([\w|\d|^"|-]*)"/g;
  const id = idPattern.exec(outerHTML);
  if (id) {
    const element = document.getElementById(id[1]);
    if (element) {
      // console.log('found element to focus by id');
      if (highlight) {
        element.classList.add('focussed-on');
      }
      element.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
  }

  let found = false;
  document.querySelectorAll(tag).forEach((element) => {
    if (elementsMatch(element, outerHTML)) {
      // console.log('found element to focus');
      if (highlight) {
        element.classList.add('focussed-on');
      }
      element.scrollIntoView({ behavior: 'smooth' });
      found = true;
    }
  });
  return found;
};

const onUnsetFocus = () => {
  document.querySelectorAll('*').forEach((element) => {
    element.classList.remove('focussed-on');
  });
};

export { onSetFocus, onUnsetFocus };
