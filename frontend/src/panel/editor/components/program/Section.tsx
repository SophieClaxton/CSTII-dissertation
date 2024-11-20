import { EditorSection } from '../../../models/ProgramComponent';
import FollowStep from './FollowStep';
import InnerStep from './InnerStep';
import '../../styles/section.css';

interface SectionProps {
  section: EditorSection;
}

const Section: React.FC<SectionProps> = ({ section }) => {
  return (
    <div className="section">
      <div className="section-meta-data">
        {section.name && <p>{section.name}</p>}
        <p>{section.url}</p>
      </div>
      {section.innerSteps.map((step) => (
        <InnerStep step={step} />
      ))}
      {section.endStep && <FollowStep step={section.endStep} />}
    </div>
  );
};

export default Section;
