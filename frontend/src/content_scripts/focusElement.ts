import stringSimilarity from 'string-similarity-js';
import { SetFocusMessage } from '../common/message';
import { similarityThreshold } from './consts';

const onSetFocus = (message: SetFocusMessage) => {
  document.querySelectorAll('*').forEach((element) => {
    if (
      stringSimilarity(element.outerHTML, message.element) > similarityThreshold
    ) {
      console.log('found element to focus');
      element.classList.add('focussed-on');
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

const onUnsetFocus = () => {
  document.querySelectorAll('*').forEach((element) => {
    element.classList.remove('focussed-on');
  });
};

export { onSetFocus, onUnsetFocus };
