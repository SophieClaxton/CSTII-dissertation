import {
  EditorFollowStep,
  EditorInnerStep,
  EditorSection,
  EditorStepType,
} from '../../../models/programComponent/ProgramComponent';
import './styles/section.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import AddNodeButton from './AddNodeButton';
import { isEndStep, isInnerStep } from '../../../models/programComponent/testers';
import { getNextSectionId, getNextStepId } from '../../../models/programComponent/getters';
import { useEditorProgramContext } from '../../contexts/EditorProgramContext';

interface SectionProps {
  section: EditorSection;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
  const { editorProgram } = useEditorProgramContext();

  const onAdd = (node: EditorInnerStep | EditorFollowStep) => {
    if (isInnerStep(node)) {
      section.innerSteps.push(node);
    }
    if (isEndStep(node) && !section.endStep) {
      section.endStep = node;
    }
  };
  const innerStepNodeChoices: EditorInnerStep[] = [
    {
      type: EditorStepType.Read,
      id: getNextStepId(section),
    },
  ];

  return (
    <div className="section" id={section.id}>
      <div className="section-meta-data">
        {section.name && <p>{section.name}</p>}
        <p>{section.url}</p>
      </div>
      <InnerStepContainer innerSteps={section.innerSteps} />
      <AddNodeButton<EditorInnerStep> onAdd={onAdd} nodeChoices={innerStepNodeChoices} />
      {section.endStep ? (
        <EndStepNode endStep={section.endStep} />
      ) : (
        <AddNodeButton<EditorFollowStep>
          onAdd={onAdd}
          nodeChoices={[
            {
              type: EditorStepType.Follow,
              id: getNextStepId(section, true),
              parentSectionId: section.id,
              nextSectionId: getNextSectionId(editorProgram),
            },
          ]}
        />
      )}
    </div>
  );
};

export default SectionNode;
