import { CSTFollowNode } from '../../models/CST/CST';
import { mapNodeIdToString } from '../../models/CST/mappers';

const getFollowEdge = (
  followStep: CSTFollowNode,
): { id: string; source: string; target: string } | undefined => {
  if (!followStep.nextSectionId) {
    return undefined;
  }
  return {
    id: `${mapNodeIdToString(followStep.id)}-${mapNodeIdToString(followStep.nextSectionId)}`,
    source: mapNodeIdToString(followStep.id),
    target: mapNodeIdToString(followStep.nextSectionId),
  };
};

export { getFollowEdge };
