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
import {
  CSTInnerStepNode,
  CSTSectionId,
  CSTSubsectionId,
} from '../../../models/CST/CST';
import { MouseSensor } from '../../flowUtils/sensors';
import { mapNodeIdToString } from '../../../models/CST/mappers';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';
import { EditorActionType } from '../../../models/EditorAction';

interface InnerStepContainerProps {
  innerSteps: CSTInnerStepNode[];
  parentId: CSTSectionId | CSTSubsectionId;
}

const InnerStepContainer: React.FC<InnerStepContainerProps> = ({
  innerSteps,
  parentId,
}) => {
  const { dispatch } = useUnpublishedScriptContext();

  const [innerStepMap, setInnerStepMap] =
    useState<Map<UniqueIdentifier, CSTInnerStepNode>>();
  const [items, setItems] = useState<UniqueIdentifier[]>([]);

  // Need the useEffect to update the items when innerSteps changes,
  // because useState creates a separate variable
  useEffect(() => {
    const innerStepMap = new Map<UniqueIdentifier, CSTInnerStepNode>();
    innerSteps.forEach((innerStep) =>
      innerStepMap.set(mapNodeIdToString(innerStep.id), innerStep),
    );
    setItems([...innerStepMap.keys()]);
    setInnerStepMap(innerStepMap);
  }, [innerSteps]);

  if (innerSteps.length !== items.length) {
    console.log('InnerSteps and items are not the same length');
    setItems(innerSteps.map((step) => mapNodeIdToString(step.id)));
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
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const newInnerSteps = newItems
        .map((item) => innerStepMap!.get(item))
        .filter((step) => step != undefined);
      dispatch({
        type: EditorActionType.RearrangeInnerSteps,
        sectionId: parentId,
        innerSteps: newInnerSteps,
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
          <InnerStepNode
            step={innerSteps.find((step) => mapNodeIdToString(step.id) === id)!}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default InnerStepContainer;
