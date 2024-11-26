import './styles/subsection.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import { isInnerStep, isEndStep } from '../../../models/programComponent/testers';
import AddNodeButton from './AddNodeButton';
import {
  EditorFollowStep,
  EditorInnerStep,
  EditorStepType,
  EditorSubsection,
} from '../../../models/programComponent/ProgramComponent';
import { getNextStepId } from '../../../models/programComponent/getters';

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
      id: getNextStepId(subsection),
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
