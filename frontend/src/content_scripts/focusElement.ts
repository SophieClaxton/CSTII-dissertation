import { elementsMatch, getElementFromId } from './elementUtils';

const onSetFocus = (
  tag: string,
  outerHTML: string,
  highlight: boolean = true,
): boolean => {
  const elementFromId = getElementFromId(outerHTML);
  if (elementFromId) {
    // console.log('found element to focus by id');
    if (highlight) {
      elementFromId.classList.add('focussed-on');
    }
    elementFromId.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
    return true;
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
