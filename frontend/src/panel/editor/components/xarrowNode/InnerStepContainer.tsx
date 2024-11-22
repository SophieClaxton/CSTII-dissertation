import { useState } from 'react';
import { EditorInnerStep } from '../../../models/ProgramComponent';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import InnerStepNode from './InnerStepNode';

interface InnerStepContainerProps {
  innerSteps: EditorInnerStep[];
}

const InnerStepContainer: React.FC<InnerStepContainerProps> = ({ innerSteps }) => {
  const [items, setItems] = useState<UniqueIdentifier[]>(innerSteps.map((step) => step.id));
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEvent = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEvent}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <InnerStepNode step={innerSteps.find((step) => step.id === id)!} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default InnerStepContainer;
