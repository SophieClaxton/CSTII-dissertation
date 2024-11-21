import { mapEditorFollowStepToId } from '../../../models/programComponent/mappers';
import { EditorFollowStep } from '../../../models/programComponent/ProgramComponent';
import './styles/step.css';

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
