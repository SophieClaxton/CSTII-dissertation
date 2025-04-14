import Stack from '@mui/material/Stack/Stack';
import { useNavigationContext } from '../../contexts/contextHooks';
import {
  helperScriptsScreen,
  scriptSelectorScreen,
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
          onClick={() => goTo(scriptSelectorScreen)}
        >
          Select Support
        </Button>
        <Button
          variant="contained"
          sx={{ width: '100%', height: '8rem' }}
          onClick={() => goTo(helperScriptsScreen)}
        >
          Start Writing Scripts
        </Button>
      </Stack>
    </Page>
  );
};

export default HomePage;
