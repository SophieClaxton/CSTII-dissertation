import { EditorFollowStep, EditorInnerStep, EditorSection, EditorStepType } from '../../../models/ProgramComponent';
import './styles/section.css';
import InnerStepContainer from './InnerStepContainer';
import EndStepNode from './EndStepNode';
import AddNodeButton from './AddNodeButton';
import { isEndStep, isInnerStep } from '../../../models/testers/programComponentTesters';

interface SectionProps {
  section: EditorSection;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
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
      id: 100,
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
          nodeChoices={[{ type: EditorStepType.Follow, id: 100, parentSectionId: section.id, nextSectionId: '10' }]}
        />
      )}
    </div>
  );
};

export default SectionNode;
