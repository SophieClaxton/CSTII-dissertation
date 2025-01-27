import stringSimilarity from 'string-similarity-js';
import { focusClass, similarityThreshold } from './consts';
import InterfaceElement from '../panel/models/InterfaceElement';

const elementsMatch = (
  element: Element,
  msgElement: InterfaceElement,
): boolean => {
  // IDEA: Try more strict comparisons and then reduce if nothing is found
  // Or reduce the similarityThreshold
  const focussed = element.classList.contains(focusClass);
  if (focussed) {
    console.log('element is focussed');
    element.classList.remove(focusClass);
  }
  const removeEmptyClass = msgElement.outerHTML.replace(/\sclass=""/g, '');
  const match =
    stringSimilarity(element.outerHTML, removeEmptyClass) > similarityThreshold;
  if (focussed) {
    element.classList.add(focusClass);
  }
  return match;
};

const findFirstElement = (
  msgElement: InterfaceElement,
): Element | undefined => {
  const element = getElementFromId(msgElement.outerHTML);
  if (element) {
    return element;
  }

  const matchingElements = [];

  const elements = document.querySelectorAll(msgElement.tag);
  for (const element of elements) {
    if (elementsMatch(element, msgElement)) {
      matchingElements.push(element);
    }
  }

  if (matchingElements.length <= 1) {
    return matchingElements.at(0);
  }

  const similarityScores = matchingElements.map((element) => ({
    element: element,
    score: stringSimilarity(element.outerHTML, msgElement.outerHTML),
  }));
  return similarityScores.reduce((best, curr) =>
    curr.score > best.score ? curr : best,
  ).element;
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

export { elementsMatch, findFirstElement, getElementFromId };
