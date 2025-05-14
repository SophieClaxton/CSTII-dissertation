import Stack from '@mui/material/Stack/Stack';
import { useNavigationContext } from '../../contexts/contextHooks';
import {
  workflowEncoderWorkflowsScreen,
  workflowSelectorScreen,
} from '../../navigation/screens';
import Button from '@mui/material/Button/Button';
import Page from '../Page';

const HomePage: React.FC = () => {
  const { goTo } = useNavigationContext();

  return (
    <Page title={'Home Screen'} noBackButton>
      <Stack spacing={2} margin={'4rem'}>
        <Button
          variant="contained"
          sx={{ width: '100%', height: '8rem' }}
          onClick={() => goTo(workflowSelectorScreen)}
        >
          Select Support
        </Button>
        <Button
          variant="contained"
          sx={{ width: '100%', height: '8rem' }}
          onClick={() => goTo(workflowEncoderWorkflowsScreen)}
        >
          Start Writing Task Workflows
        </Button>
      </Stack>
    </Page>
  );
};

export default HomePage;
