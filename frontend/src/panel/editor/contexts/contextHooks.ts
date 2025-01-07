import { useContext } from 'react';
import { UnpublishedScriptContext } from './UnpublishedScriptContext';
import { ScreenContext, ScreenContextState } from './ScreenContext';
import { ScreenType } from '../../models/ScreenType';

const useUnpublishedScriptContext = () => {
  const editorProgramContext = useContext(UnpublishedScriptContext);
  if (!editorProgramContext) {
    throw new Error('No editor program found');
  }
  return editorProgramContext;
};

const useScreenContext = () => {
  const screenContext = useContext(ScreenContext);
  if (!screenContext) {
    console.log('No screen context found');
    throw new Error('No screen context is loaded');
  }
  return screenContext;
};

const getScreenContextState = (
  screenStack: ScreenType[],
  setScreenStack: (value: ScreenType[]) => void,
): ScreenContextState => {
  if (screenStack.length === 0) {
    return {
      getCurrentScreen: () => undefined,
      removeCurrentScreen: () => undefined,
      addScreen: (screen: ScreenType) =>
        setScreenStack([screen, ...screenStack]),
    };
  }
  const [topScreen, ...bottomScreens] = screenStack;
  return {
    getCurrentScreen: () => topScreen,
    removeCurrentScreen: () => setScreenStack(bottomScreens),
    addScreen: (screen: ScreenType) => setScreenStack([screen, ...screenStack]),
  };
};

export { useUnpublishedScriptContext, useScreenContext, getScreenContextState };
