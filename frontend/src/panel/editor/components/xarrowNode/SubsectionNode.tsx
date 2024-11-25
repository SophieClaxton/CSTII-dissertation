import { EditorSubsection } from '../../../models/ProgramComponent';
import './styles/subsection.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';

interface SubsectionNodeProps {
  subsection: EditorSubsection;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  return (
    <div className="subsection">
      <p>{subsection.answer}</p>
      <InnerStepContainer innerSteps={subsection.innerSteps} />
      {subsection.endStep && <EndStepNode endStep={subsection.endStep} />}
    </div>
  );
};

export default SubsectionNode;
