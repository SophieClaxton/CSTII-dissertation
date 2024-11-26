import { EditorFollowStep } from '../../models/programComponent/ProgramComponent';
import { mapEditorFollowStepToId } from '../../models/programComponent/mappers';

const getFollowEdge = (followStep: EditorFollowStep): { id: string; source: string; target: string } => ({
  id: `${mapEditorFollowStepToId(followStep)}-${followStep.nextSectionId}`,
  source: mapEditorFollowStepToId(followStep),
  target: followStep.nextSectionId,
});

export { getFollowEdge };
