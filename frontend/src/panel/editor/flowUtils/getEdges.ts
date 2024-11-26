import { EditorFollowStep } from '../../models/ProgramComponent';
import { mapEditorFollowStepToId } from '../../models/mappers/programComponentMapper';

const getFollowEdge = (followStep: EditorFollowStep): { id: string; source: string; target: string } => ({
  id: `${mapEditorFollowStepToId(followStep)}-${followStep.nextSectionId}`,
  source: mapEditorFollowStepToId(followStep),
  target: followStep.nextSectionId,
});

export { getFollowEdge };
