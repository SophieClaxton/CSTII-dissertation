import stringSimilarity from 'string-similarity-js';
import { focusClass, similarityThreshold } from './consts';
import InterfaceElement from '../panel/models/interfaceElement/InterfaceElement';
import { ValidTag } from '../panel/models/interfaceElement/validTags';

const elementsMatch = (
  element: Element,
  msgElement: InterfaceElement,
): boolean => {
  // IDEA: Try more strict comparisons and then reduce if nothing is found
  // Or reduce the similarityThreshold
  const id = extractElementId(msgElement.outerHTML);
  if (id && element.id === id) {
    return true;
  }

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

const extractElementId = (elementOuterHTML: string): string | undefined => {
  const idPattern = /id="([\w|\d|^"|-]*)"/g;
  const id = idPattern.exec(elementOuterHTML);
  return id ? id[1] : undefined;
};

const getElementFromId = (
  elementOuterHTML: string,
): HTMLElement | undefined => {
  const id = extractElementId(elementOuterHTML);
  if (id) {
    const element = document.getElementById(id);
    return element ?? undefined;
  }
  return undefined;
};

const elementSatisfiesValidTags = (
  element: Element,
  validTags: ValidTag[],
): boolean => {
  return validTags.some(
    ({ tag, condition }) =>
      element.tagName === tag && (condition ? condition(element) : true),
  );
};

const getCorrespondingLabel = (element: Element): string | undefined => {
  const labels = document.getElementsByTagName('label');
  for (const label of labels) {
    if (label.htmlFor === element.id) {
      return label.textContent ?? undefined;
    }
  }
  return undefined;
};

export {
  elementsMatch,
  findFirstElement,
  getElementFromId,
  elementSatisfiesValidTags,
  getCorrespondingLabel,
};
