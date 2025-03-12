import { focusClass, scrollDuration } from '../consts';
import { findElement } from './elementUtils';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SupportState } from '../userSupport/state';
import InterfaceElement from '../../panel/models/interfaceElement/InterfaceElement';

// IDEA: scroll any scrollable parent elements into view, and then scroll parents as necessary
const scrollToElement = (
  element: Element,
  supportState: SupportState,
  onScrollEnd: (element: Element, supportState: SupportState) => void,
) => {
  gsap.registerPlugin(ScrollToPlugin);
  if (supportState.systemScrolling) {
    return;
  }

  console.log(`Scrolling to ${element.textContent}`);
  supportState.systemScrolling = true;
  gsap.to(window, {
    duration: scrollDuration,
    scrollTo: {
      y: element,
      autoKill: true,
      offsetY: 100,
      onAutoKill: () => {
        supportState.systemScrolling = false;
        console.log('Ended system scrolling');
      },
    },
    ease: 'power2.inOut',
  });
  setTimeout(() => {
    supportState.systemScrolling = false;
    onScrollEnd(element, supportState);
  }, scrollDuration * 1250);
};

const setFocus = (
  msgElement: InterfaceElement,
  supportState: SupportState,
  highlight: boolean = true,
  onScrollEnd: (element: Element, supportState: SupportState) => void = () =>
    undefined,
) => {
  const element = findElement(msgElement);
  if (element) {
    if (highlight) {
      element.classList.add(focusClass);
      console.log(element);
    }
    scrollToElement(element, supportState, onScrollEnd);
  } else {
    console.error('Element not found');
  }
};

const unsetFocus = () => {
  document.querySelectorAll('*').forEach((element) => {
    element.classList.remove(focusClass);
  });
};

export { setFocus, unsetFocus };
