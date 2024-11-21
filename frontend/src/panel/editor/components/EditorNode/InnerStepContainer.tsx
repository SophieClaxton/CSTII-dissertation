import { useEffect, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
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
import { useXarrow } from 'react-xarrows';
import { EditorInnerStep } from '../../../models/programComponent/ProgramComponent';
import { MouseSensor } from '../../flowUtils/sensors';

interface InnerStepContainerProps {
  innerSteps: EditorInnerStep[];
}

const InnerStepContainer: React.FC<InnerStepContainerProps> = ({
  innerSteps,
}) => {
  const [items, setItems] = useState<UniqueIdentifier[]>(
    innerSteps.map((step) => step.id),
  );

  // Need the useEffect to update the items when innerSteps changes,
  // because useState creates a separate variable
  useEffect(() => {
    setItems(innerSteps.map((step) => step.id));
  }, [innerSteps]);

  if (innerSteps.length !== items.length) {
    console.log('InnerSteps and items are not the same length');
    setItems(innerSteps.map((step) => step.id));
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const updateArrows = useXarrow();

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event: DragEndEvent) => {
        handleDragEvent(event);
        updateArrows();
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <InnerStepNode step={innerSteps.find((step) => step.id === id)!} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default InnerStepContainer;
