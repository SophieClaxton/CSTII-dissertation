import { CSTFollowNode, CSTSectionNode } from '../../../models/CST/CST';
import { mapIdToString } from '../../unpublished_script_reducer/mappers/nodeIds';
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
    target: mapIdToString(sections[0].id),
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
    id: `${mapIdToString(followStep.id)}-${mapIdToString(followStep.nextSectionId)}`,
    source: mapIdToString(followStep.id),
    target: mapIdToString(followStep.nextSectionId),
  };
};

export { getEdges };
export type { Edge };
