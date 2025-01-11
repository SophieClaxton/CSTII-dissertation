import { CSTFollowNode } from '../../../models/CST/CST';
import ElementSelector from '../ElementSelector';
import Step from '../Step';

interface FollowNodeProps {
  step: CSTFollowNode;
}

const FollowNode: React.FC<FollowNodeProps> = ({ step }) => {
  return (
    <Step stepId={step.id} className="follow-step">
      <p>{step.type.toUpperCase()}</p>
      <ElementSelector stepId={step.id} element={step.element} />
    </Step>
  );
};

export default FollowNode;
