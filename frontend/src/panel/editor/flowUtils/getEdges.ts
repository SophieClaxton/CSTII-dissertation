import { Edge } from '@xyflow/react';
import { EditorFollowStep } from '../../models/ProgramComponent';
import { mapEditorFollowStepToId } from '../../models/mappers/programComponentMapper';

const getFollowEdge = (followStep: EditorFollowStep): Edge => ({
  id: `${mapEditorFollowStepToId(followStep)}-${followStep.nextSectionId}`,
  source: mapEditorFollowStepToId(followStep),
  target: followStep.nextSectionId,
});

export { getFollowEdge };
