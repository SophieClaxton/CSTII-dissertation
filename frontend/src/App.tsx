import './App.css';
import { setUpPortListener } from './messaging/portListener';
import { useEffect, useState } from 'react';
import HomePage from './side_panel/components/pages/HomePage';
import { PanelScreen } from './side_panel/navigation/ScreenType';
import { ScreenContext } from './side_panel/contexts/ScreenContext';
import TabContext, { TabInfo } from './side_panel/contexts/TabContext';
import { setCurrentTab, setTabListeners } from './messaging/tabs';
import { ConfirmProvider } from 'material-ui-confirm';

function App() {
  const [screenStack, setScreenStack] = useState<PanelScreen[]>([]);
  const [tab, setTab] = useState<TabInfo | undefined>();

  useEffect(() => {
    setUpPortListener();
    setCurrentTab(setTab, true);
    setTabListeners(setTab);
  }, []);

  const currentScreen = screenStack.at(0);
  const currentComponent = currentScreen ? (
    currentScreen.component
  ) : (
    <HomePage />
  );

  return (
    <ScreenContext.Provider
      value={{
        screenStack: screenStack,
        setScreenStack: setScreenStack,
      }}
    >
      <TabContext.Provider value={{ tab }}>
        <ConfirmProvider>{currentComponent}</ConfirmProvider>
      </TabContext.Provider>
    </ScreenContext.Provider>
  );
}

export default App;
