import { EditorFollowStep, EditorInnerStep, EditorStepType, EditorSubsection } from '../../../models/ProgramComponent';
import './styles/subsection.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import { isInnerStep, isEndStep } from '../../../models/testers/programComponentTesters';
import AddNodeButton from './AddNodeButton';

interface SubsectionNodeProps {
  subsection: EditorSubsection;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  const onAdd = (node: EditorInnerStep | EditorFollowStep) => {
    if (isInnerStep(node)) {
      subsection.innerSteps.push(node);
    }
    if (isEndStep(node) && !subsection.endStep) {
      subsection.endStep = node;
    }
  };
  const innerStepNodeChoices: EditorInnerStep[] = [
    {
      type: EditorStepType.Read,
      id: 100,
    },
  ];

  return (
    <div className="subsection">
      <p>{subsection.answer}</p>
      <InnerStepContainer innerSteps={subsection.innerSteps} />
      <AddNodeButton<EditorInnerStep> onAdd={onAdd} nodeChoices={innerStepNodeChoices} />
      {subsection.endStep && <EndStepNode endStep={subsection.endStep} />}
    </div>
  );
};

export default SubsectionNode;
