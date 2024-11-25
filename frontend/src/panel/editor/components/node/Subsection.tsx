import { EditorSubsection } from '../../../models/ProgramComponent';
import InnerStep from './InnerStep';
import './styles/subsection.css';

interface SubsectionProps {
  subsection: EditorSubsection;
}

const Subsection: React.FC<SubsectionProps> = ({ subsection }) => {
  return (
    <div className="subsection">
      <p>{subsection.answer}</p>
      {subsection.innerSteps.map((step) => (
        <InnerStep step={step} />
      ))}
      {subsection.endStep && <div className="empty-follow"></div>}
    </div>
  );
};

export default Subsection;
