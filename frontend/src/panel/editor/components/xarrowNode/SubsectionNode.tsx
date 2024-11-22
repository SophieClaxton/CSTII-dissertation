import { EditorSubsection } from '../../../models/ProgramComponent';
import '../../styles/subsection.css';
import FollowNode from './FollowNode';
import InnerStepNode from './InnerStepNode';

interface SubsectionNodeProps {
  subsection: EditorSubsection;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  return (
    <div className="subsection">
      <p>{subsection.answer}</p>
      {subsection.innerSteps.map((step) => (
        <InnerStepNode step={step} />
      ))}
      {subsection.endStep && <FollowNode step={subsection.endStep} />}
    </div>
  );
};

export default SubsectionNode;
