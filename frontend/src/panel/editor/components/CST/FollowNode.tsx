import { mapNodeIdToString } from '../../../models/CST/mappers';
import { CSTFollowNode } from '../../../models/CST/CST';
import './styles/step.css';

interface FollowNodeProps {
  step: CSTFollowNode;
}

const FollowNode: React.FC<FollowNodeProps> = ({ step }) => {
  return (
    <div className="step follow-step" id={mapNodeIdToString(step.id)}>
      <p>{step.type.toUpperCase()}</p>
      {step.element && <p>{step.element.tag}</p>}
    </div>
  );
};

export default FollowNode;
