import { EditorStep } from '../../../models/programComponent/ProgramComponent';

interface AddNodeButtonProps<T extends EditorStep> {
  onAdd: (node: T) => void;
  nodeChoices: T[];
}

const AddNodeButton = <T extends EditorStep>(props: AddNodeButtonProps<T>) => {
  const { onAdd, nodeChoices } = props;
  return (
    <button
      className="step add-node-button"
      onClick={() => {
        console.log('CLICK');
        onAdd(nodeChoices[0]);
      }}
    >
      + Instruction
    </button>
  );
};

export default AddNodeButton;
