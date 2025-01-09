import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';
import { useEffect, useState } from 'react';
import HomeScreen from './panel/components/HomeScreen';
import { PanelScreen } from './panel/navigation/ScreenType';
import { ScreenContext } from './panel/contexts/ScreenContext';

function App() {
  useEffect(setUpMessageHandler, []);

  const [screenStack, setScreenStack] = useState<PanelScreen[]>([]);

  const currentScreen = screenStack.at(0);
  const currentComponent = currentScreen ? (
    currentScreen.component
  ) : (
    <HomeScreen />
  );

  return (
    <ScreenContext.Provider
      value={{
        screenStack: screenStack,
        setScreenStack: setScreenStack,
      }}
    >
      {currentComponent}
    </ScreenContext.Provider>
  );
}

export default App;
