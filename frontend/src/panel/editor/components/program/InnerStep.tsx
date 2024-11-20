import { EditorInnerStep, EditorStepType } from '../../../models/ProgramComponent';
import Subsection from './Subsection';
import '../../styles/step.css';

interface InnerStepProps {
  step: EditorInnerStep;
}

const InnerStep: React.FC<InnerStepProps> = ({ step }) => {
  switch (step.type) {
    case EditorStepType.UserDecision:
      return (
        <div className="user-decision-group">
          <div className="step">
            <p>{step.type.toUpperCase()}</p>
            <p>{step.question}</p>
          </div>
          <div className="decision-outcomes">
            <Subsection subsection={step.choice1} />
            <Subsection subsection={step.choice2} />
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

export default InnerStep;
