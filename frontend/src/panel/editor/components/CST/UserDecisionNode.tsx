import { DraggableAttributes } from '@dnd-kit/core';
import SubsectionNode from './SubsectionNode';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSTUserDecisionNode } from '../../../models/CST/CST';
import { BaseStep } from '../Step';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';

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
    <BaseStep
      stepId={step.id}
      stepType={step.type}
      sortableProps={sortableProps}
    >
      <Stack sx={{ width: 'fit-content', marginBottom: '0.25rem' }}>
        <Stack sx={{ flexDirection: 'row', gap: '0.5rem' }}>
          <Typography
            variant={'h6'}
            sx={{
              width: 'fit-content',
              gridArea: 'stepName',
              textWrap: 'wrap',
              textAlign: 'left',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {step.type}
          </Typography>
          <p>{step.question}</p>
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
