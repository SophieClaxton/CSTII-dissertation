import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './styles/step.css';
import UserDecisionNode from './UserDecisionNode';
import { CSTInnerStepNode, CSTStepNodeType } from '../../../models/CST/CST';
import { mapNodeIdToString } from '../../../models/CST/mappers';

interface InnerStepNodeProps {
  step: CSTInnerStepNode;
}

const InnerStepNode: React.FC<InnerStepNodeProps> = ({ step }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: mapNodeIdToString(step.id) });

  const style = { transform: CSS.Transform.toString(transform), transition };

  switch (step.type) {
    case CSTStepNodeType.UserDecision:
      return (
        <UserDecisionNode
          step={step}
          sortableProps={{
            setNodeRef: setNodeRef,
            style: style,
            attributes: attributes,
            listeners: listeners,
          }}
        />
      );
    default:
      return (
        <div
          className="step draggable-step"
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          key={mapNodeIdToString(step.id)}
        >
          <p>{step.type.toUpperCase()}</p>
          {step.element && <p>{step.element.tag}</p>}
        </div>
      );
  }
};

export default InnerStepNode;
