import { useSortable } from '@dnd-kit/sortable';
import { EditorInnerStep, EditorStepType } from '../../../models/ProgramComponent';
import { CSS } from '@dnd-kit/utilities';
import './styles/step.css';
import UserDecisionNode from './UserDecisionNode';

interface InnerStepNodeProps {
  step: EditorInnerStep;
}

const InnerStepNode: React.FC<InnerStepNodeProps> = ({ step }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  switch (step.type) {
    case EditorStepType.UserDecision:
      return (
        <UserDecisionNode
          step={step}
          sortableProps={{ setNodeRef: setNodeRef, style: style, attributes: attributes, listeners: listeners }}
        />
      );
    default:
      return (
        <div className="step" ref={setNodeRef} style={style} {...attributes} {...listeners} key={step.id}>
          <p>{step.type.toUpperCase()}</p>
          {step.element && <p>{step.element.tag}</p>}
        </div>
      );
  }
};

export default InnerStepNode;
