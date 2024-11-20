import { EditorSubsection } from '../../../models/ProgramComponent';
import FollowStep from './FollowStep';
import InnerStep from './InnerStep';
import '../../styles/subsection.css';

interface SubsectionProps {
  subsection: EditorSubsection;
}

const Subsection: React.FC<SubsectionProps> = ({ subsection }) => {
  return (
    <div className="subsection">
      {subsection.innerSteps.map((step) => (
        <InnerStep step={step} />
      ))}
      {subsection.endStep && <FollowStep step={subsection.endStep} />}
    </div>
  );
};

export default Subsection;
