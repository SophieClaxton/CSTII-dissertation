import stringSimilarity from 'string-similarity-js';
import { similarityThreshold } from './consts';

const elementsMatch = (element: Element, msgElement: string): boolean => {
  return stringSimilarity(element.outerHTML, msgElement) > similarityThreshold;
};

export { elementsMatch };
