import { CSTFollowNode } from '../../../models/CST/CST';
import Step from '../Step';

interface FollowNodeProps {
  step: CSTFollowNode;
}

const FollowNode: React.FC<FollowNodeProps> = ({ step }) => {
  return (
    <Step nodeId={step.id} className="follow-step">
      <p>{step.type.toUpperCase()}</p>
      {step.element && <p>{step.element.tag}</p>}
    </Step>
  );
};

export default FollowNode;
