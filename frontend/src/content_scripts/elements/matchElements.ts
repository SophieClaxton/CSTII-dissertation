import stringSimilarity from 'string-similarity-js';
import InterfaceElement from '../../panel/models/interfaceElement/InterfaceElement';
import {
  commonAttr,
  mapTagToRelevantAttributes,
} from '../../panel/models/interfaceElement/validAttribute';
import { similarityThreshold } from '../consts';

const extractOpeningTag = (elementOuterHTML: string): string | null => {
  const openingTagPattern = /<([\s \S][^>]*)>/g;
  const openingTag = openingTagPattern.exec(elementOuterHTML);
  return openingTag ? openingTag[1] : '';
};

const extractElementAttribute = (
  elementOuterHTML: string,
  attribute: string,
): string | null => {
  const attrPatter = new RegExp(` ${attribute}="([\\s \\S][^"]*)"`, 'g');
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
  showErrorMessages: boolean = false,
): boolean => {
  if (element.tagName != msgElement.tag) {
    return false;
  }
  const msgElementOpeningTag = extractOpeningTag(msgElement.outerHTML);
  if (!msgElementOpeningTag) {
    console.error('Could not extract opening tag');
    return false;
  }
  if (element.id === extractElementAttribute(msgElementOpeningTag, 'id')) {
    if (showErrorMessages) {
      console.log('Matched ids');
    }
    return true;
  }
  for (const { attr, condition } of commonAttr) {
    if (
      (!condition || condition(element)) &&
      element.getAttribute(attr) !==
        extractElementAttribute(msgElementOpeningTag, attr)
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
        extractElementAttribute(msgElementOpeningTag, attr)
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

export { extractOpeningTag, extractElementAttribute, elementsMatch };
