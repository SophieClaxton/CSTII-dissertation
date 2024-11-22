import { EditorInnerStep, EditorStepType } from '../../../models/ProgramComponent';
import '../../styles/step.css';
import SubsectionNode from './SubsectionNode';

interface InnerStepNodeProps {
  step: EditorInnerStep;
}

const InnerStepNode: React.FC<InnerStepNodeProps> = ({ step }) => {
  switch (step.type) {
    case EditorStepType.UserDecision:
      return (
        <div className="step">
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
        <div className="step">
          <p>{step.type.toUpperCase()}</p>
          {step.element && <p>{step.element.tag}</p>}
        </div>
      );
  }
};

export default InnerStepNode;
