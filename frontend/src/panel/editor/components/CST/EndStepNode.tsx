import { CSTEndStepNode, CSTStepNodeType } from '../../../models/CST/CST';
import FollowNode from './FollowNode';
import UserDecisionNode from './UserDecisionNode';

interface EndStepNodeProps {
  endStep: CSTEndStepNode;
}

const EndStepNode: React.FC<EndStepNodeProps> = ({ endStep }) => {
  switch (endStep.type) {
    case CSTStepNodeType.Follow:
      return <FollowNode step={endStep} />;
    case CSTStepNodeType.UserDecision:
      return <UserDecisionNode step={endStep} />;
  }
};

export default EndStepNode;
