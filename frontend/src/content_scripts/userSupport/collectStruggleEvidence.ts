import { SupportState } from './state';

const collectUserStruggleDataOnMouseMove =
  (supportState: SupportState) => (ev: MouseEvent) => {
    if (supportState.collectStruggleData) {
      supportState.userStruggleData.totalDistance += Math.sqrt(
        Math.pow(ev.movementX, 2) + Math.pow(ev.movementY, 2),
      );
    }
  };

const collectUserStruggleDataOnMouseDown =
  (supportState: SupportState) => () => {
    if (supportState.collectStruggleData) {
      supportState.userStruggleData.numMouseClicks += 1;
    }
  };

const collectStruggleDataOnScroll = (supportState: SupportState) => {
  if (supportState.collectStruggleData) {
    supportState.userStruggleData.totalScrollDistance +=
      Math.abs(window.scrollX - supportState.lastScrollPosition.x) +
      Math.abs(window.scrollY - supportState.lastScrollPosition.y);
    supportState.lastScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
    };
  }
};

export {
  collectUserStruggleDataOnMouseMove,
  collectUserStruggleDataOnMouseDown,
  collectStruggleDataOnScroll,
};
