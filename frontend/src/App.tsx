import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';
import { useState } from 'react';
import HomeScreen from './panel/components/HomeScreen';
import Editor from './panel/editor/Editor';
import ScriptSelectionPage from './panel/support/script_selection/ScriptSelectionPage';
import { ScreenType } from './panel/models/ScreenType';
import { ScreenContext } from './panel/contexts/ScreenContext';
import ScriptSupport from './panel/support/script_support/ScriptSupport';

const getScreenComponent = (screen: ScreenType | undefined) => {
  switch (screen) {
    case undefined:
      return <HomeScreen />;
    case ScreenType.Editor:
      return <Editor />;
    case ScreenType.ScriptSelector:
      return <ScriptSelectionPage />;
    case ScreenType.ScriptSupport:
      return <ScriptSupport />;
  }
};

function App() {
  setUpMessageHandler();

  const [screenStack, setScreenStack] = useState<ScreenType[]>([]);
  const [paramStack, setParamStack] = useState<number[]>([]);

  const screenComponent = getScreenComponent(screenStack.at(0));

  return (
    <ScreenContext.Provider
      value={{
        screenStack: screenStack,
        setScreenStack: setScreenStack,
        paramStack: paramStack,
        setParamStack: setParamStack,
      }}
    >
      {screenComponent}
    </ScreenContext.Provider>
  );
}

export default App;
