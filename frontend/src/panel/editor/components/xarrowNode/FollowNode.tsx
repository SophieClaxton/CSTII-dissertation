import { mapEditorFollowStepToId } from '../../../models/mappers/programComponentMapper';
import { EditorFollowStep } from '../../../models/ProgramComponent';
import '../../styles/step.css';

interface FollowNodeProps {
  step: EditorFollowStep;
}

const FollowNode: React.FC<FollowNodeProps> = ({ step }) => {
  return (
    <div className="step follow-step" id={mapEditorFollowStepToId(step)}>
      <p>{step.type.toUpperCase()}</p>
      {step.element && <p>{step.element.tag}</p>}
    </div>
  );
};

export default FollowNode;
