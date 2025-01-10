import ClickedElementsDisplay from './ClickedElementsDisplay';
import { useNavigationContext } from '../contexts/contextHooks';
import {
  helperScriptsScreen,
  scriptSelectorScreen,
} from '../navigation/screens';

const HomeScreen: React.FC = () => {
  const { goTo } = useNavigationContext();

  return (
    <>
      <h1>SC2370 Project</h1>
      <button onClick={() => goTo(helperScriptsScreen)}>
        Start Writing Scripts
      </button>
      <button onClick={() => goTo(scriptSelectorScreen)}>
        Go to Script Selector
      </button>
      <ClickedElementsDisplay />
    </>
  );
};

export default HomeScreen;
