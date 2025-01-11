import Stack from '@mui/material/Stack/Stack';
import { useNavigationContext } from '../contexts/contextHooks';
import {
  helperScriptsScreen,
  scriptSelectorScreen,
} from '../navigation/screens';
import Button from '@mui/material/Button/Button';

const HomeScreen: React.FC = () => {
  const { goTo } = useNavigationContext();

  return (
    <>
      <h1>SC2370 Project Hi</h1>
      <Stack spacing={2} margin={'4rem'}>
        <Button
          variant="contained"
          sx={{ width: '100%', height: '8rem' }}
          onClick={() => goTo(scriptSelectorScreen)}
        >
          Go to Script Selector
        </Button>
        <Button
          variant="contained"
          sx={{ width: '100%', height: '8rem' }}
          onClick={() => goTo(helperScriptsScreen)}
        >
          Start Writing Scripts
        </Button>
      </Stack>
    </>
  );
};

export default HomeScreen;
