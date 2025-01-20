import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';
import { useEffect, useState } from 'react';
import HomeScreen from './panel/components/HomeScreen';
import { PanelScreen } from './panel/navigation/ScreenType';
import { ScreenContext } from './panel/contexts/ScreenContext';
import TabContext from './panel/contexts/TabContext';
import { setCurrentTab, setTabListeners } from './common/tabs';

function App() {
  useEffect(setUpMessageHandler, []);

  const [screenStack, setScreenStack] = useState<PanelScreen[]>([]);
  const [tab, setTab] = useState<chrome.tabs.Tab>();

  useEffect(() => {
    setCurrentTab(setTab);
    setTabListeners(setTab);
  }, []);

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
      <TabContext.Provider value={{ tab }}>
        {currentComponent}
      </TabContext.Provider>
    </ScreenContext.Provider>
  );
}

export default App;
