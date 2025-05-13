import { SupportState } from './state';

const collectInteractionDataOnMouseMove =
  (supportState: SupportState) => (ev: MouseEvent) => {
    if (supportState.collectInteractionData) {
      supportState.interactionData.totalDistance += Math.sqrt(
        Math.pow(ev.movementX, 2) + Math.pow(ev.movementY, 2),
      );
    }
  };

const collectInteractionDataOnMouseDown =
  (supportState: SupportState) => () => {
    if (supportState.collectInteractionData) {
      supportState.interactionData.numMouseClicks += 1;
    }
  };

const collectInteractionDataOnScroll = (supportState: SupportState) => {
  if (supportState.collectInteractionData) {
    supportState.interactionData.totalScrollDistance +=
      Math.abs(window.scrollX - supportState.lastScrollPosition.x) +
      Math.abs(window.scrollY - supportState.lastScrollPosition.y);
    supportState.lastScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
    };
  }
};

export {
  collectInteractionDataOnMouseMove,
  collectInteractionDataOnMouseDown,
  collectInteractionDataOnScroll,
};
