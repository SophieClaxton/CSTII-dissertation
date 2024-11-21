import { EditorFollowStep } from '../../../models/ProgramComponent';
import '../../styles/step.css';

interface FollowNodeProps {
  step: EditorFollowStep;
}

const FollowNode: React.FC<FollowNodeProps> = ({ step }) => {
  return (
    <>
      <p>{step.type.toUpperCase()}</p>
      {step.element && <p>{step.element.tag}</p>}
    </>
  );
};

export default FollowNode;
