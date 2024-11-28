import './styles/subsection.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import AddNodeButton from './AddNodeButton';
import { EditorSubsection } from '../../../models/programComponent/ProgramComponent';
import { addEditorStepToSection } from '../../../models/programComponent/setters';
import { useEditorProgramContext } from '../../contexts/useEditorProgramContext';
import { getNodeChoices } from '../../../models/programComponent/getters';

interface SubsectionNodeProps {
  subsection: EditorSubsection;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  const { dispatch } = useEditorProgramContext();
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
