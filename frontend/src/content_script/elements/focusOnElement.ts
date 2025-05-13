import { focusClass, scrollDuration } from '../consts';
import { findElement } from './elementUtils';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SupportState } from '../interactive_support/state';
import InterfaceElement from '../../side_panel/models/interface_element/InterfaceElement';

const elementIsVisible = (
  element: Element,
  threshold: { top: number; bottom: number; left: number; right: number } = {
    top: 0.2,
    bottom: 0.4,
    left: 0,
    right: 0,
  },
): boolean => {
  const boundingRect = element.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight,
  );
  const viewWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth,
  );
  console.log('Element rect, and window height and width');
  console.log(boundingRect);
  console.log(viewHeight);
  console.log(viewWidth);
  return (
    boundingRect.top > viewHeight * threshold.top &&
    boundingRect.bottom + viewHeight * threshold.bottom < viewHeight &&
    boundingRect.left > viewHeight * threshold.left &&
    boundingRect.right + viewHeight * threshold.right < viewWidth
  );
};

// IDEA: scroll any scrollable parent elements into view, and then scroll parents as necessary
const scrollToElement = (
  element: Element,
  supportState: SupportState,
  onScrollEnd: (element: Element, supportState: SupportState) => void,
) => {
  gsap.registerPlugin(ScrollToPlugin);
  if (elementIsVisible(element)) {
    supportState.timeoutId = setTimeout(() => {
      onScrollEnd(element, supportState);
    }, scrollDuration * 750);
    return;
  }

  if (supportState.systemScrolling) {
    return;
  }

  console.log(`Scrolling to ${element.textContent}`);
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight,
  );
  supportState.systemScrolling = true;
  gsap.to(window, {
    duration: scrollDuration,
    scrollTo: {
      y: element,
      offsetY: viewHeight * 0.2,
      autoKill: true,
      onAutoKill: () => {
        supportState.systemScrolling = false;
        console.log('Ended system scrolling');
      },
    },
    ease: 'power2.inOut',
  });
  supportState.timeoutId = setTimeout(() => {
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
  attempts: number = 0,
) => {
  unsetFocus();
  const element = findElement(msgElement);
  if (element) {
    if (highlight) {
      element.classList.add(focusClass);
      console.log(element);
    }
    scrollToElement(element, supportState, onScrollEnd);
  } else {
    console.error('Element not found');
    if (attempts < 5) {
      supportState.timeoutId = setTimeout(
        () => setFocus(msgElement, supportState, highlight, onScrollEnd),
        1000,
      );
    }
  }
};

const unsetFocus = () => {
  document.querySelectorAll('*').forEach((element) => {
    element.classList.remove(focusClass);
  });
};

export { setFocus, unsetFocus };
