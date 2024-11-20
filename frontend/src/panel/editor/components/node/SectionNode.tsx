import { EditorSection } from '../../../models/ProgramComponent';
import FollowStep from '../program/FollowStep';
import InnerStep from '../program/InnerStep';
import '../../styles/section.css';

interface SectionProps {
  section: EditorSection;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
  return (
    <>
      <div className="section-meta-data">
        {section.name && <p>{section.name}</p>}
        <p>{section.url}</p>
      </div>
      {section.innerSteps.map((step) => (
        <InnerStep step={step} />
      ))}
      {section.endStep && <FollowStep step={section.endStep} />}
    </>
  );
};

export default SectionNode;
