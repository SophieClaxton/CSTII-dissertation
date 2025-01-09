import { useContext } from 'react';
import { UnpublishedScriptContext } from './UnpublishedScriptContext';
import {
  NavigationContext,
  ScreenContext,
  ScreenContextState,
} from './ScreenContext';
import { PanelScreen } from '../navigation/ScreenType';

const useUnpublishedScriptContext = () => {
  const editorProgramContext = useContext(UnpublishedScriptContext);
  if (!editorProgramContext) {
    throw new Error('No editor program found');
  }
  return editorProgramContext;
};

const useNavigationContext = () => {
  const screenContext = useContext(ScreenContext);
  if (!screenContext) {
    console.log('No screen context found');
    throw new Error('No screen context is loaded');
  }
  return getNavigationContext(screenContext);
};

const getNavigationContext = ({
  screenStack,
  setScreenStack,
}: ScreenContextState): NavigationContext => {
  const [topScreen, ...bottomScreens] = screenStack;

  return {
    currentScreen: screenStack.length > 0 ? topScreen : undefined,
    goBack: () =>
      screenStack.length > 0 ? setScreenStack(bottomScreens) : undefined,
    goTo: (screen: PanelScreen) => setScreenStack([screen, ...screenStack]),
  };
};

export {
  useUnpublishedScriptContext,
  useNavigationContext as useNavigationContext,
};
