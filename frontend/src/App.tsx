import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';
import { useMemo, useState } from 'react';
import HomeScreen from './panel/components/HomeScreen';
import Editor from './panel/editor/Editor';
import ScriptSelectionPage from './panel/support/script-selection/ScriptSelectionPage';
import { ScreenType } from './panel/models/ScreenType';
import { ScreenContext } from './panel/editor/contexts/ScreenContext';
import { getScreenContextState } from './panel/editor/contexts/contextHooks';

const CurrentScreen: React.FC<{ screen: ScreenType | undefined }> = ({
  screen,
}) => {
  switch (screen) {
    case undefined:
      return <HomeScreen />;
    case ScreenType.Editor:
      return <Editor />;
    case ScreenType.Support:
      return <ScriptSelectionPage />;
  }
};

function App() {
  setUpMessageHandler();

  const [screenStack, setScreenStack] = useState<ScreenType[]>([]);
  const screenContextState = useMemo(
    () => getScreenContextState(screenStack, setScreenStack),
    [screenStack, setScreenStack],
  );

  return (
    <ScreenContext.Provider value={screenContextState}>
      <CurrentScreen screen={screenContextState.getCurrentScreen()} />
    </ScreenContext.Provider>
  );
}

export default App;
