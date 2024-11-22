import { useSortable } from '@dnd-kit/sortable';
import { EditorInnerStep, EditorStepType } from '../../../models/ProgramComponent';
import Subsection from './Subsection';
import './styles/step.css';
import { CSS } from '@dnd-kit/utilities';

interface InnerStepProps {
  step: EditorInnerStep;
}

const InnerStep: React.FC<InnerStepProps> = ({ step }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  switch (step.type) {
    case EditorStepType.UserDecision:
      return (
        <div className="xy-step nodrag" ref={setNodeRef} style={style} {...attributes} {...listeners} key={step.id}>
          <p>{step.type.toUpperCase()}</p>
          <p>{step.question}</p>
          <div className="decision-outcomes">
            <Subsection subsection={step.choice1} />
            <Subsection subsection={step.choice2} />
          </div>
        </div>
      );
    default:
      return (
        <div className="xy-step nodrag" ref={setNodeRef} style={style} {...attributes} {...listeners} key={step.id}>
          <p>{step.type.toUpperCase()}</p>
          {step.element && <p>{step.element.tag}</p>}
        </div>
      );
  }
};

export default InnerStep;
