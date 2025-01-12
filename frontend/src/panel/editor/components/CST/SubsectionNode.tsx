import { CSTSubsectionNode } from '../../../models/CST/CST';
import { getNodeChoices } from '../../../models/CST/getters';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';
import AddNodeButton from '../AddNodeButton';
import InnerStepContainer from '../InnerStepContainer';
import EndStepNode from './EndStepNode';
import '../styles/subsection.css';
import { EditorActionType } from '../../../models/EditorAction';

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
      <InnerStepContainer
        innerSteps={subsection.innerSteps}
        parentId={subsection.id}
      />
      <AddNodeButton
        onAdd={(step) => dispatch({ type: EditorActionType.AddStep, step })}
        nodeChoices={getNodeChoices(subsection)}
      />
      {subsection.endStep && <EndStepNode endStep={subsection.endStep} />}
    </div>
  );
};

export default SubsectionNode;
