import { DraggableAttributes } from '@dnd-kit/core';
import SubsectionNode from './SubsectionNode';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import {
  CSTUserDecisionEndType,
  CSTUserDecisionNode,
} from '../../../models/CST/CST';
import { mapNodeIdToString } from '../../../models/CST/mappers';

interface UserDecisionNodeProps {
  step: CSTUserDecisionNode;
  sortableProps?: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: { transform: string | undefined; transition: string | undefined };
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
}

const UserDecisionNode: React.FC<UserDecisionNodeProps> = ({
  step,
  sortableProps,
}) => {
  const { setNodeRef, style, attributes, listeners } = sortableProps ?? {
    setNodeRef: undefined,
    style: undefined,
    attributes: undefined,
    listeners: undefined,
  };

  return (
    <div
      className={`step ${step.endsWithFollow == CSTUserDecisionEndType.InnerStep ? 'draggableStep' : ''}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={mapNodeIdToString(step.id)}
    >
      <p>{step.type.toUpperCase()}</p>
      <p>{step.question}</p>
      <div className="decision-outcomes">
        <SubsectionNode subsection={step.choice1} />
        <SubsectionNode subsection={step.choice2} />
      </div>
    </div>
  );
};

export default UserDecisionNode;
