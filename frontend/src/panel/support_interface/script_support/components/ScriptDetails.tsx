import Stack from '@mui/material/Stack/Stack';
import { Script } from '../../../models/api/Script';
import Typography from '@mui/material/Typography/Typography';

interface ScriptDetailsProps {
  script: Script;
}

const ScriptDetails: React.FC<ScriptDetailsProps> = ({ script }) => {
  const createdAtDate = new Date(script.created_at);
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
        {script.title}
      </Typography>
      <Typography variant={'body1'} gutterBottom sx={{ textAlign: 'left' }}>
        {script.description}
      </Typography>
      <Stack direction={'row'} spacing={3}>
        <Typography variant={'subtitle2'}>
          Author: {script.author.name}
        </Typography>
        <Typography variant={'subtitle2'}>Created: {dateString}</Typography>
      </Stack>
    </Stack>
  );
};

export default ScriptDetails;
