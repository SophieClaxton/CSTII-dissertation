import { CSTFollowNode, CSTSectionNode } from '../../models/CST/CST';
import { mapNodeIdToString } from '../../models/CST/mappers';
import { getFollowSteps } from './getNodes';

interface Edge {
  id: string;
  source: string;
  target: string;
}

const getEdges = (sections: CSTSectionNode[]): Edge[] => {
  const initialEdge = {
    id: 'start-1',
    source: 'start',
    target: mapNodeIdToString(sections[0].id),
  };

  const followSteps: CSTFollowNode[] = sections.map(getFollowSteps).flat();

  const followEdges = followSteps
    .map(getFollowEdge)
    .filter((edge) => edge != undefined);

  return [initialEdge, ...followEdges];
};

const getFollowEdge = (followStep: CSTFollowNode): Edge | undefined => {
  if (!followStep.nextSectionId) {
    return undefined;
  }
  return {
    id: `${mapNodeIdToString(followStep.id)}-${mapNodeIdToString(followStep.nextSectionId)}`,
    source: mapNodeIdToString(followStep.id),
    target: mapNodeIdToString(followStep.nextSectionId),
  };
};

export { getEdges };
export type { Edge };
