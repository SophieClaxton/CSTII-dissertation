import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import UserDecisionNode from './UserDecisionNode';
import { CSTInnerStepNode, CSTStepNodeType } from '../../../models/CST/CST';
import Step from '../Step';
import ElementSelector from '../ElementSelector';
import { mapIdToString } from '../../../unpublishedScriptReducer/mappers/nodeIds';

interface InnerStepNodeProps {
  step: CSTInnerStepNode;
}

const InnerStepNode: React.FC<InnerStepNodeProps> = ({ step }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: mapIdToString(step.id) });

  const style = { transform: CSS.Transform.toString(transform), transition };

  switch (step.type) {
    case CSTStepNodeType.UserDecision:
      return (
        <UserDecisionNode
          step={step}
          sortableProps={{
            setNodeRef: setNodeRef,
            style: style,
            attributes: attributes,
            listeners: listeners,
          }}
        />
      );
    default:
      return (
        <Step
          stepId={step.id}
          stepType={step.type}
          sortableProps={{
            setNodeRef: setNodeRef,
            style: style,
            attributes: attributes,
            listeners: listeners,
          }}
        >
          <ElementSelector stepId={step.id} element={step.element} />
        </Step>
      );
  }
};

export default InnerStepNode;
