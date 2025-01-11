import { useState } from 'react';
import { useXarrow } from 'react-xarrows';
import { CSTStepNode } from '../../models/CST/CST';

interface AddNodeButtonProps<T extends CSTStepNode> {
  onAdd: (node: T) => void;
  nodeChoices: T[];
}

const AddNodeButton = <T extends CSTStepNode>(props: AddNodeButtonProps<T>) => {
  const { onAdd, nodeChoices } = props;
  const [showNodeChoices, setShowNodeChoices] = useState(false);
  const updateArrows = useXarrow();
  if (showNodeChoices) {
    return (
      <div>
        {nodeChoices.map((choice) => (
          <button
            className="step add-node-button"
            onClick={() => {
              onAdd(choice);
              setShowNodeChoices(false);
              updateArrows();
            }}
          >
            {choice.type}
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      className="step add-node-button"
      onClick={() => {
        setShowNodeChoices(true);
        updateArrows();
      }}
    >
      + Instruction
    </button>
  );
};

export default AddNodeButton;
