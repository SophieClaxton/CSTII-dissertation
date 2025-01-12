import { CSTNodeId } from '../../models/CST/CST';
import {
  isInnerStepId,
  isEndStepId,
  isSubsectionId,
  isSectionId,
} from '../../models/CST/testers';

const mapIdToString = (nodeId: CSTNodeId): string => {
  if ('sectionId' in nodeId) {
    return `S${nodeId.sectionId}`;
  } else if ('subsectionId' in nodeId) {
    return `${mapIdToString(nodeId.parentId)}.s${nodeId.subsectionId}`;
  } else if ('stepId' in nodeId) {
    return `${mapIdToString(nodeId.parentId)}.${nodeId.stepId}`;
  }
  throw new Error(`Could not translate node id ${nodeId}`);
};

const getIdValueFromChunk = (string: string): number => {
  const number = Number(string.slice(1, string.length));
  if (isNaN(number)) {
    throw new Error(`invalid node id value ${string}`);
  }
  return number;
};

const mapStringToId = (string: string): CSTNodeId => {
  const nodeIdChunks = string.split('.');
  if (nodeIdChunks.length === 0) {
    throw Error(`invalid node id string ${string}: no chunks`);
  }
  const [sectionIdString, ...rest] = nodeIdChunks;
  const sectionId = { sectionId: getIdValueFromChunk(sectionIdString) };
  return rest.reduce<CSTNodeId>((parentId: CSTNodeId, nextChunk: string) => {
    if (
      nextChunk[0] === 's' &&
      (isInnerStepId(parentId) || isEndStepId(parentId))
    ) {
      return { parentId, subsectionId: getIdValueFromChunk(nextChunk) };
    } else if (
      nextChunk[0] === 'E' &&
      (isSubsectionId(parentId) || isSectionId(parentId))
    ) {
      return { parentId, stepId: 'E' };
    } else if (
      !isNaN(+nextChunk) &&
      (isSubsectionId(parentId) || isSectionId(parentId))
    ) {
      return { parentId, stepId: +nextChunk };
    } else {
      throw Error(
        `invalid node id string ${string}: for ${nextChunk} with parent ${mapIdToString(parentId)}`,
      );
    }
  }, sectionId);
};

export { mapIdToString, mapStringToId };
