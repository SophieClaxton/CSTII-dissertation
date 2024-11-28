import {
  EditorEndStep,
  EditorStepType,
} from '../../../models/programComponent/ProgramComponent';
import FollowNode from './FollowNode';
import UserDecisionNode from './UserDecisionNode';

interface EndStepNodeProps {
  endStep: EditorEndStep;
}

const EndStepNode: React.FC<EndStepNodeProps> = ({ endStep }) => {
  switch (endStep.type) {
    case EditorStepType.Follow:
      return <FollowNode step={endStep} />;
    case EditorStepType.UserDecision:
      return <UserDecisionNode step={endStep} />;
  }
};

export default EndStepNode;
