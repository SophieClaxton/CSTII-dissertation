import { DraggableAttributes } from '@dnd-kit/core';
import SubsectionNode from './SubsectionNode';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSTUserDecisionNode } from '../../../models/CST/CST';
import Step from '../Step';

interface UserDecisionNodeProps {
  step: CSTUserDecisionNode;
  sortableProps?: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: { transform: string | undefined; transition: string | undefined };
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
}

const UserDecisionNode: React.FC<UserDecisionNodeProps> = ({
  step,
  sortableProps,
}) => {
  return (
    <Step stepId={step.id} sortableProps={sortableProps}>
      <p>{step.type.toUpperCase()}</p>
      <p>{step.question}</p>
      <div className="decision-outcomes">
        <SubsectionNode subsection={step.choice1} />
        <SubsectionNode subsection={step.choice2} />
      </div>
    </Step>
  );
};

export default UserDecisionNode;
