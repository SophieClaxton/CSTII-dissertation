import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';
import { ReactNode, useEffect, useState } from 'react';
import HomeScreen from './panel/components/HomeScreen';
import Editor from './panel/editor/Editor';
import ScriptSelectionPage from './panel/support/script_selection/ScriptSelectionPage';
import { ScreenType } from './panel/models/ScreenType';
import { ScreenContext } from './panel/contexts/ScreenContext';
import ScriptSupport from './panel/support/script_support/ScriptSupport';
import UserScriptSelectionPage from './panel/support/script_selection/UserScriptSelectionPage';
import WebsiteScriptSelectionPage from './panel/support/script_selection/WebsiteScriptSelectionPage';

const getScreenComponent = (screen: ScreenType | undefined) => {
  const screenComponents: Record<ScreenType, ReactNode> = {
    [ScreenType.Editor]: <Editor />,
    [ScreenType.ScriptSelector]: <ScriptSelectionPage />,
    [ScreenType.UserScriptSelector]: <UserScriptSelectionPage />,
    [ScreenType.WebsiteScriptSelector]: <WebsiteScriptSelectionPage />,
    [ScreenType.ScriptSupport]: <ScriptSupport />,
  };

  if (!screen) {
    return <HomeScreen />;
  }
  return screenComponents[screen];
};

function App() {
  useEffect(setUpMessageHandler, []);

  const [screenStack, setScreenStack] = useState<ScreenType[]>([]);
  const [paramStack, setParamStack] = useState<number[]>([]);

  return (
    <ScreenContext.Provider
      value={{
        screenStack: screenStack,
        setScreenStack: setScreenStack,
        paramStack: paramStack,
        setParamStack: setParamStack,
      }}
    >
      {getScreenComponent(screenStack.at(0))}
    </ScreenContext.Provider>
  );
}

export default App;
