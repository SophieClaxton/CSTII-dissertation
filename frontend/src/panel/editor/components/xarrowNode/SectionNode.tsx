import { EditorSection } from '../../../models/ProgramComponent';
import './styles/section.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';

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
      {section.endStep && <EndStepNode endStep={section.endStep} />}
    </div>
  );
};

export default SectionNode;
