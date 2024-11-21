import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor,
} from '@dnd-kit/core';
import { MouseEvent, TouchEvent } from 'react';

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

// Block DnD event propagation if element have "data-no-dnd" attribute
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