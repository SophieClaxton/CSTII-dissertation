import { CSTFollowNode } from '../../../models/CST/CST';
import ElementSelector from '../ElementSelector';
import Step from '../Step';

interface FollowNodeProps {
  step: CSTFollowNode;
}

const FollowNode: React.FC<FollowNodeProps> = ({ step }) => {
  return (
    <Step stepId={step.id} stepType={step.type} className="follow-step">
      <ElementSelector step={step} />
    </Step>
  );
};

export default FollowNode;
