import './styles/subsection.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import AddNodeButton from './AddNodeButton';
import { CSTSubsectionNode } from '../../../models/CST/CST';
import { addEditorStepToSection } from '../../../models/CST/setters';
import { getNodeChoices } from '../../../models/CST/getters';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';

interface SubsectionNodeProps {
  subsection: CSTSubsectionNode;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  const { dispatch } = useUnpublishedScriptContext();
  // console.log(`Rendering subsection node ${subsection.id}`);
  // console.log(subsection);
  return (
    <div className="subsection">
      <p>{subsection.answer}</p>
      <InnerStepContainer innerSteps={subsection.innerSteps} />
      <AddNodeButton
        onAdd={(step) => addEditorStepToSection(dispatch, subsection, step)}
        nodeChoices={getNodeChoices(subsection)}
      />
      {subsection.endStep && <EndStepNode endStep={subsection.endStep} />}
    </div>
  );
};

export default SubsectionNode;
