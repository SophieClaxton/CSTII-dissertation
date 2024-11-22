import { EditorSection } from '../../../models/ProgramComponent';
import '../../styles/section.css';
import FollowNode from './FollowNode';
import InnerStepContainer from './InnerStepContainer';

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
      <InnerStepContainer innerSteps={section.innerSteps} />
      {section.endStep && <FollowNode step={section.endStep} />}
    </div>
  );
};

export default SectionNode;
