import { useSortable } from '@dnd-kit/sortable';
import { EditorInnerStep, EditorStepType } from '../../../models/ProgramComponent';
import { CSS } from '@dnd-kit/utilities';
import '../../styles/step.css';
import SubsectionNode from './SubsectionNode';

interface InnerStepNodeProps {
  step: EditorInnerStep;
}

const InnerStepNode: React.FC<InnerStepNodeProps> = ({ step }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  switch (step.type) {
    case EditorStepType.UserDecision:
      return (
        <div className="step" ref={setNodeRef} style={style} {...attributes} {...listeners} key={step.id}>
          <p>{step.type.toUpperCase()}</p>
          <p>{step.question}</p>
          <div className="decision-outcomes">
            <SubsectionNode subsection={step.choice1} />
            <SubsectionNode subsection={step.choice2} />
          </div>
        </div>
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
