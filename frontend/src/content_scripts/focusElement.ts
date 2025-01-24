import { focusClass } from './consts';
import { elementsMatch, getElementFromId } from './elementUtils';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SupportState } from './userSupport/state';
import { sendDetectionMessage } from './userSupport/detectStep';
import { ASTInstruction } from '../panel/models/AST/Instruction';
import { ASTNodeType } from '../panel/models/AST/AST';

gsap.registerPlugin(ScrollToPlugin);

// elementFromId.scrollIntoView({
//   behavior: 'smooth',
//   block: 'center',
//   inline: 'center',
// });
const scrollToElement = (
  element: Element,
  supportState: SupportState,
  step: ASTInstruction | undefined = undefined,
) => {
  if (supportState.systemScrolling) {
    return;
  }
  console.log(`Scrolling to ${element.textContent}`);
  supportState.systemScrolling = true;
  const scrollDuration = 2;
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
    if (
      step &&
      step.type === ASTNodeType.ScrollTo &&
      supportState.collectStruggleData
    ) {
      supportState.timeoutId = setTimeout(
        () => sendDetectionMessage(supportState, step),
        3000,
      );
    }
  }, 2000);
};

const onSetFocus = (
  tag: string,
  outerHTML: string,
  supportState: SupportState,
  highlight: boolean = true,
  step: ASTInstruction | undefined = undefined,
): boolean => {
  const elementFromId = getElementFromId(outerHTML);
  if (elementFromId) {
    // console.log('found element to focus by id');
    if (highlight) {
      elementFromId.classList.add(focusClass);
    }
    scrollToElement(elementFromId, supportState, step);
    return true;
  }

  let found = false;
  document.querySelectorAll(tag).forEach((element) => {
    if (elementsMatch(element, outerHTML)) {
      // console.log('found element to focus');
      if (highlight) {
        element.classList.add(focusClass);
      }
      scrollToElement(element, supportState, step);
      found = true;
    }
  });
  return found;
};

const onUnsetFocus = () => {
  document.querySelectorAll('*').forEach((element) => {
    if (element.classList.contains(focusClass)) {
      element.classList.remove(focusClass);
    }
  });
};

export { onSetFocus, onUnsetFocus };
