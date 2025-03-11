import stringSimilarity from 'string-similarity-js';
import InterfaceElement from '../../panel/models/interfaceElement/InterfaceElement';
import {
  commonAttr,
  mapTagToRelevantAttributes,
} from '../../panel/models/interfaceElement/validAttribute';
import { similarityThreshold } from '../consts';

const extractElementAttribute = (
  elementOuterHTML: string,
  attribute: string,
): string | null => {
  const attrPatter = new RegExp(`${attribute}="([\\w|\\d|\\-|\\s]*)"`, 'g');
  const attr = attrPatter.exec(elementOuterHTML);
  return attr ? attr[1] : null;
};

const displayAttrErrorMessage = (
  element: Element,
  msgElement: InterfaceElement,
  attr: string,
  showErrorMessages: boolean = false,
) => {
  if (!showErrorMessages) {
    return;
  }
  console.log('Failed on', attr);
  console.log('Element had: ', element.getAttribute(attr));
  console.log('Msg had: ', extractElementAttribute(msgElement.outerHTML, attr));
};

const elementsMatch = (
  element: Element,
  msgElement: InterfaceElement,
): boolean => {
  const showErrorMessages = false;

  if (element.tagName != msgElement.tag) {
    return false;
  }
  if (element.id === extractElementAttribute(msgElement.outerHTML, 'id')) {
    return true;
  }
  for (const { attr, condition } of commonAttr) {
    if (
      (!condition || condition(element)) &&
      element.getAttribute(attr) !==
        extractElementAttribute(msgElement.outerHTML, attr)
    ) {
      if (showErrorMessages) {
        displayAttrErrorMessage(element, msgElement, attr, showErrorMessages);
      }
      return false;
    }
  }
  for (const { attr, condition } of mapTagToRelevantAttributes[
    msgElement.tag
  ]) {
    if (
      (!condition || condition(element)) &&
      element.getAttribute(attr) !==
        extractElementAttribute(msgElement.outerHTML, attr)
    ) {
      displayAttrErrorMessage(element, msgElement, attr, showErrorMessages);
      return false;
    }
  }
  if (
    element.textContent != null &&
    msgElement.textContent != null &&
    element.textContent.length > 0 &&
    msgElement.textContent.length > 0
  ) {
    return (
      stringSimilarity(element.textContent, msgElement.textContent) >
      similarityThreshold
    );
  }
  return true;
};

export { extractElementAttribute, elementsMatch };
