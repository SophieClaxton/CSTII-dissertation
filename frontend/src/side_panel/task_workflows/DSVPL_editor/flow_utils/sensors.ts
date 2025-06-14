import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor,
} from '@dnd-kit/core';
import { MouseEvent, TouchEvent } from 'react';

// Block DnD event propagation if element has "data-no-dnd" attribute
// Solution developed from https://github.com/clauderic/dnd-kit/issues/477

const isInteractiveElement = (element: Element | null) => {
  const interactiveElements = [
    'button',
    'input',
    'textarea',
    'select',
    'option',
  ];
  if (
    element?.tagName &&
    interactiveElements.includes(element.tagName.toLowerCase())
  ) {
    return true;
  }

  return false;
};

const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement;

  while (cur) {
    if ((cur.dataset && cur.dataset.noDnd) || isInteractiveElement(cur)) {
      return false;
    }
    cur = cur.parentElement as HTMLElement;
  }

  return true;
};

export class MouseSensor extends LibMouseSensor {
  static activators = [
    { eventName: 'onMouseDown', handler },
  ] as (typeof LibMouseSensor)['activators'];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    { eventName: 'onTouchStart', handler },
  ] as (typeof LibTouchSensor)['activators'];
}
