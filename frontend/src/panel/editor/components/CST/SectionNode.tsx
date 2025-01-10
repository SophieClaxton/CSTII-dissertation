import { CSTSectionNode, CSTStepNode } from '../../../models/CST/CST';
import './styles/section.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import AddNodeButton from './AddNodeButton';
import { addEditorStepToSection } from '../../../models/CST/setters';
import { getNodeChoices } from '../../../models/CST/getters';
import { mapNodeIdToString } from '../../../models/CST/mappers';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';

interface SectionProps {
  section: CSTSectionNode;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
  const { dispatch } = useUnpublishedScriptContext();

  return (
    <div className="section" id={mapNodeIdToString(section.id)}>
      <div className="section-meta-data">
        <p>{section.url}</p>
      </div>
      <InnerStepContainer
        innerSteps={section.innerSteps}
        parentId={section.id}
      />
      <AddNodeButton<CSTStepNode>
        onAdd={(step) => addEditorStepToSection(dispatch, section, step)}
        nodeChoices={getNodeChoices(section)}
      />
      {section.endStep && <EndStepNode endStep={section.endStep} />}
    </div>
  );
};

export default SectionNode;
