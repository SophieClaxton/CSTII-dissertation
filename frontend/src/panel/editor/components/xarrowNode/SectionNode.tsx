import { EditorSection } from '../../../models/ProgramComponent';
import '../../styles/section.css';
import FollowNode from './FollowNode';
import InnerStepNode from './InnerStepNode';

interface SectionProps {
  section: EditorSection;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
  return (
    <div className="section" id={section.id}>
      <div className="section-meta-data">
        {section.name && <p>{section.name}</p>}
        <p>{section.url}</p>
      </div>
      {section.innerSteps.map((step) => (
        <InnerStepNode step={step} />
      ))}
      {section.endStep && <FollowNode step={section.endStep} />}
    </div>
  );
};

export default SectionNode;
