import {
  EditorSection,
  EditorStep,
} from '../../../models/programComponent/ProgramComponent';
import './styles/section.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import AddNodeButton from './AddNodeButton';
import { addEditorStepToSection } from '../../../models/programComponent/setters';
import { useEditorProgramContext } from '../../contexts/useEditorProgramContext';
import { getNodeChoices } from '../../../models/programComponent/getters';

interface SectionProps {
  section: EditorSection;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
  const { dispatch } = useEditorProgramContext();

  return (
    <div className="section" id={section.id}>
      <div className="section-meta-data">
        {section.name && <p>{section.name}</p>}
        <p>{section.url}</p>
      </div>
      <InnerStepContainer innerSteps={section.innerSteps} />
      <AddNodeButton<EditorStep>
        onAdd={(step) => addEditorStepToSection(dispatch, section, step)}
        nodeChoices={getNodeChoices(section)}
      />
      {section.endStep && <EndStepNode endStep={section.endStep} />}
    </div>
  );
};

export default SectionNode;
