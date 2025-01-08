import ClickedElementsDisplay from './ClickedElementsDisplay';
import { ScreenType } from '../models/ScreenType';
import { useNavigationContext } from '../contexts/contextHooks';

const HomeScreen: React.FC = () => {
  const { addScreen } = useNavigationContext();

  return (
    <>
      <h1>SC2370 Project</h1>
      <button onClick={() => addScreen(ScreenType.Editor)}>Go to Editor</button>
      <button onClick={() => addScreen(ScreenType.ScriptSelector)}>
        Go to Script Selector
      </button>
      <ClickedElementsDisplay />
    </>
  );
};

export default HomeScreen;
