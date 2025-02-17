import { focusClass, scrollDuration } from './consts';
import { findFirstElement } from './elementUtils';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SupportState } from './userSupport/state';
import InterfaceElement from '../panel/models/InterfaceElement';

// IDEA: scroll any scrollable parent elements into view, and then scroll parents as necessary
const scrollToElement = (
  element: Element,
  supportState: SupportState,
  onFocusComplete: (element: Element, supportState: SupportState) => void,
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
    onFocusComplete(element, supportState);
  }, scrollDuration * 1250);
};

const onSetFocus = (
  msgElement: InterfaceElement,
  supportState: SupportState,
  highlight: boolean = true,
  onFocusComplete: (
    element: Element,
    supportState: SupportState,
  ) => void = () => undefined,
): boolean => {
  const element = findFirstElement(msgElement);
  if (element) {
    if (highlight) {
      element.classList.add(focusClass);
      console.log(element);
    }
    scrollToElement(element, supportState, onFocusComplete);
    return true;
  }
  return false;
};

const onUnsetFocus = () => {
  document.querySelectorAll('*').forEach((element) => {
    if (element.classList.contains(focusClass)) {
      element.classList.remove(focusClass);
    }
  });
};

export { onSetFocus, onUnsetFocus };
