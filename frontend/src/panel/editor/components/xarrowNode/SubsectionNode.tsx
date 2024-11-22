import { EditorSubsection } from '../../../models/ProgramComponent';
import './styles/subsection.css';
import FollowNode from './FollowNode';
import InnerStepContainer from './InnerStepContainer';

interface SubsectionNodeProps {
  subsection: EditorSubsection;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  return (
    <div className="subsection">
      <p>{subsection.answer}</p>
      <InnerStepContainer innerSteps={subsection.innerSteps} />
      {subsection.endStep && <FollowNode step={subsection.endStep} />}
    </div>
  );
};

export default SubsectionNode;
