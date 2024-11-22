import { EditorSection } from '../../../models/ProgramComponent';
import InnerStep from '../program/InnerStep';
import '../program/styles/section.css';

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
      {section.endStep && <div className="empty-follow"></div>}
    </>
  );
};

export default SectionNode;
