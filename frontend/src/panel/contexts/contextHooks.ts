import { useContext } from 'react';
import { UnpublishedScriptContext } from './UnpublishedScriptContext';
import {
  NavigationContext,
  ScreenContext,
  ScreenContextState,
} from './ScreenContext';
import { ScreenType } from '../models/ScreenType';

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
  paramStack,
  setParamStack,
}: ScreenContextState): NavigationContext => {
  const [topScreen, ...bottomScreens] = screenStack;
  const [topParam, ...bottomParams] = paramStack;

  return {
    currentScreen: screenStack.length > 0 ? topScreen : undefined,
    removeCurrentScreen: () =>
      screenStack.length > 0 ? setScreenStack(bottomScreens) : undefined,
    addScreen: (screen: ScreenType) => setScreenStack([screen, ...screenStack]),
    currentParam: paramStack.length > 0 ? topParam : undefined,
    removeCurrentParam: () =>
      paramStack.length > 0 ? setParamStack(bottomParams) : undefined,
    addParam: (id: number) => setParamStack([id, ...paramStack]),
  };
};

export {
  useUnpublishedScriptContext,
  useNavigationContext as useNavigationContext,
};
