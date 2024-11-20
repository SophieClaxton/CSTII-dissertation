import { EditorFollowStep } from '../../../models/ProgramComponent';
import '../../styles/step.css';

interface FollowStepProps {
  step: EditorFollowStep;
}

const FollowStep: React.FC<FollowStepProps> = ({ step }) => {
  return (
    <div className="step">
      <p>{step.type.toUpperCase()}</p>
      {step.element && <p>{step.element.tag}</p>}
    </div>
  );
};

export default FollowStep;
