import { useState } from 'react';
import { EditorStep } from '../../../models/programComponent/ProgramComponent';
import { useXarrow } from 'react-xarrows';

interface AddNodeButtonProps<T extends EditorStep> {
  onAdd: (node: T) => void;
  nodeChoices: T[];
}

const AddNodeButton = <T extends EditorStep>(props: AddNodeButtonProps<T>) => {
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
