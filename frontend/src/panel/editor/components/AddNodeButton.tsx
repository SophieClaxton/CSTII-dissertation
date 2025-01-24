import { useState } from 'react';
import { useXarrow } from 'react-xarrows';
import { CSTStepNode } from '../../models/CST/CST';
import Stack from '@mui/material/Stack/Stack';

interface AddNodeButtonProps<T extends CSTStepNode> {
  onAdd: (node: T) => void;
  nodeChoices: T[];
  stepWidth?: boolean;
}

const AddNodeButton = <T extends CSTStepNode>(props: AddNodeButtonProps<T>) => {
  const { onAdd, nodeChoices, stepWidth } = props;
  const [showNodeChoices, setShowNodeChoices] = useState(false);
  const updateArrows = useXarrow();
  if (showNodeChoices) {
    return (
      <Stack
        sx={{
          width: '25.625rem',
          gap: '0.365rem',
          flexFlow: 'row wrap',
        }}
      >
        {nodeChoices.map((choice) => (
          <button
            style={{
              minWidth: '6rem',
              flex: '1 1 0',
              borderRadius: '0.5rem',
              outlineColor: 'rgba(60, 60, 60, 0.25)',
              outlineStyle: 'dashed',
              outlineWidth: '2px',
              padding: '0.5rem',
            }}
            onClick={() => {
              onAdd(choice);
              setShowNodeChoices(false);
              updateArrows();
            }}
          >
            {choice.type}
          </button>
        ))}
      </Stack>
    );
  }

  return (
    <button
      onClick={() => {
        setShowNodeChoices(true);
        updateArrows();
      }}
      style={{
        width: stepWidth ? '25.625rem' : 'fit-content',
        borderRadius: '0.5rem',
        outlineColor: 'rgba(60, 60, 60, 0.25)',
        outlineStyle: 'dashed',
        outlineWidth: '2px',
        padding: '0.5rem',
      }}
    >
      + Instruction
    </button>
  );
};

export default AddNodeButton;
