import { Node } from '@xyflow/react';
import { EditorFollowStep, EditorSection } from '../ProgramComponent';
import { ReactNode } from 'react';

const mapEditorSectionToSectionNode = (section: EditorSection, sectionElement: ReactNode, sectionNo: number): Node => ({
  id: section.id.toString(),
  type: 'output',
  position: { x: 16, y: 64 + sectionNo * 480 },
  data: { label: sectionElement },
  className: 'section',
});

const mapEditorFollowStepToId = (followStep: EditorFollowStep) => {
  return `${followStep.parentSectionId}F`;
};

const mapEditorFollowStepToFollowNode = (followStep: EditorFollowStep, followStepElement: ReactNode): Node => ({
  id: mapEditorFollowStepToId(followStep),
  type: 'input',
  position: { x: 16, y: 294 },
  data: { label: followStepElement },
  className: 'step follow-step',
  parentId: followStep.parentSectionId[0],
  draggable: false,
});

export { mapEditorSectionToSectionNode, mapEditorFollowStepToId, mapEditorFollowStepToFollowNode };
