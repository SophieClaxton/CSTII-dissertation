import stringSimilarity from 'string-similarity-js';
import { similarityThreshold } from './consts';

const elementsMatch = (element: Element, msgElement: string): boolean => {
  const focussed = element.classList.contains('focussed-on');
  if (focussed) {
    element.classList.remove('focussed-on');
  }
  const match =
    stringSimilarity(element.outerHTML, msgElement) > similarityThreshold;
  if (focussed) {
    element.classList.add('focussed-on');
  }
  return match;
};

const getElementFromId = (
  elementOuterHTML: string,
): HTMLElement | undefined => {
  const idPattern = /id="([\w|\d|^"|-]*)"/g;
  const id = idPattern.exec(elementOuterHTML);
  if (id) {
    const element = document.getElementById(id[1]);
    return element ?? undefined;
  }
  return undefined;
};

export { elementsMatch, getElementFromId };
