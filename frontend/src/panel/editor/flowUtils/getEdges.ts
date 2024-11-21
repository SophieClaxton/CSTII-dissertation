import { EditorFollowStep } from '../../models/programComponent/ProgramComponent';
import { mapEditorFollowStepToId } from '../../models/programComponent/mappers';

const getFollowEdge = (
  followStep: EditorFollowStep,
): { id: string; source: string; target: string } | undefined => {
  if (!followStep.nextSectionId) {
    return undefined;
  }
  return {
    id: `${mapEditorFollowStepToId(followStep)}-${followStep.nextSectionId}`,
    source: mapEditorFollowStepToId(followStep),
    target: followStep.nextSectionId,
  };
};

export { getFollowEdge };
