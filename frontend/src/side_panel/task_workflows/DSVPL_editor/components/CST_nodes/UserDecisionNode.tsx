import { DraggableAttributes } from '@dnd-kit/core';
import SubsectionNode from './SubsectionNode';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSTUserDecisionNode } from '../../../../models/CST/CST';
import { BaseStep } from '../Step';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import TextField from '@mui/material/TextField/TextField';
import { useState } from 'react';
import { useUnpublishedWorkflowContext } from '../../../../contexts/contextHooks';
import { EditorActionType } from '../../../../models/EditorAction';

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
  const { dispatch } = useUnpublishedWorkflowContext();
  const [question, setQuestion] = useState('');

  return (
    <BaseStep
      stepId={step.id}
      stepType={step.type}
      sortableProps={sortableProps}
    >
      <Stack sx={{ width: 'fit-content', marginBottom: '0.25rem' }}>
        <Stack sx={{ flexDirection: 'row', gap: '1rem' }}>
          <Typography
            variant={'h6'}
            sx={{
              width: 'max-content',
              textWrap: 'nowrap',
              textAlign: 'left',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {step.type}
          </Typography>
          <TextField
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onBlur={() =>
              dispatch({
                type: EditorActionType.EditUserDecisionQuestion,
                question,
                stepId: step.id,
              })
            }
            size={'small'}
            placeholder={'Question'}
            fullWidth
            slotProps={{
              input: { sx: { backgroundColor: 'white' } },
              htmlInput: { sx: { padding: '0.25rem 0.5rem' } },
            }}
            sx={{ alignSelf: 'center' }}
          />
        </Stack>
        <Stack sx={{ flexDirection: 'row', gap: '0.5rem' }}>
          <SubsectionNode subsection={step.choice1} />
          <SubsectionNode subsection={step.choice2} />
        </Stack>
      </Stack>
    </BaseStep>
  );
};

export default UserDecisionNode;
