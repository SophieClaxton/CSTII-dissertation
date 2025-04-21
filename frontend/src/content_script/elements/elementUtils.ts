import stringSimilarity from 'string-similarity-js';
import InterfaceElement from '../../side_panel/models/interface_element/InterfaceElement';
import { ValidTag } from '../../side_panel/models/interface_element/validTags';
import { elementsMatch, extractElementAttribute } from './matchElements';

const findElement = (msgElement: InterfaceElement): Element | undefined => {
  const elementFromId = getElementFromId(msgElement.outerHTML);
  if (elementFromId) {
    return elementFromId;
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

  console.log('found multiple matching elements');
  console.log(matchingElements);
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
  const id = extractElementAttribute(elementOuterHTML, 'id');
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
    if (
      (label.htmlFor != '' &&
        element.id != '' &&
        label.htmlFor === element.id) ||
      label.innerHTML.includes(element.outerHTML)
    ) {
      console.log(label);
      return label.textContent ?? undefined;
    }
  }
  return undefined;
};

export {
  findElement,
  getElementFromId,
  elementSatisfiesValidTags,
  getCorrespondingLabel,
};
