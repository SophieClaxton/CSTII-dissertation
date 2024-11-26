interface AddNodeButtonProps<T> {
  onAdd: (node: T) => void;
  nodeChoices: T[];
}

const AddNodeButton = <T,>(props: AddNodeButtonProps<T>) => {
  const { onAdd, nodeChoices } = props;
  return (
    <button className="step add-node-button" onClick={() => onAdd(nodeChoices[0])}>
      + Instruction
    </button>
  );
};

export default AddNodeButton;
