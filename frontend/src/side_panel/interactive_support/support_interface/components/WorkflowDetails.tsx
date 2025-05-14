import Stack from '@mui/material/Stack/Stack';
import { TaskWorkflow } from '../../../models/api/TaskWorkflow';
import Typography from '@mui/material/Typography/Typography';

interface WorkflowDetailsProps {
  workflow: TaskWorkflow;
}

const WorkflowDetails: React.FC<WorkflowDetailsProps> = ({ workflow }) => {
  const createdAtDate = new Date(workflow.created_at);
  const dateString = createdAtDate.toLocaleDateString();

  return (
    <Stack
      direction={'column'}
      sx={{
        gap: '0.25rem',
        width: '100%',
        padding: '1rem',
      }}
    >
      <Typography
        variant={'h6'}
        component={'h1'}
        gutterBottom
        sx={{ textAlign: 'left' }}
      >
        {workflow.title}
      </Typography>
      <Typography variant={'body1'} gutterBottom sx={{ textAlign: 'left' }}>
        {workflow.description}
      </Typography>
      <Stack direction={'row'} spacing={3}>
        <Typography variant={'subtitle2'}>
          Author: {workflow.author.name}
        </Typography>
        <Typography variant={'subtitle2'}>Created: {dateString}</Typography>
      </Stack>
    </Stack>
  );
};

export default WorkflowDetails;
