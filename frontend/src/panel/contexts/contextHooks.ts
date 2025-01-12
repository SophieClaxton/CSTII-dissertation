import { useContext } from 'react';
import { UnpublishedScriptContext } from './UnpublishedScriptContext';
import {
  NavigationContext,
  ScreenContext,
  ScreenContextState,
} from './ScreenContext';
import { PanelScreen } from '../navigation/ScreenType';
import { TypeErrorsContext } from './TypeErrorsContext';
import { TypeCheckError } from '../models/CST/typeCheck';
import { mapIdToString } from '../unpublishedScriptReducer/mappers/nodeIds';

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

const createTypeErrorsContext = (
  typeErrors: TypeCheckError[],
): Map<string, string> => {
  const typeErrorsMap = new Map<string, string>();
  typeErrors.forEach((error: TypeCheckError) => {
    typeErrorsMap.set(mapIdToString(error.location), error.reason);
  });
  return typeErrorsMap;
};

const useTypeErrorsContext = () => {
  const typeErrorContext = useContext(TypeErrorsContext);
  if (!typeErrorContext) {
    throw new Error('No type errors context found');
  }
  return typeErrorContext;
};

export {
  useUnpublishedScriptContext,
  useNavigationContext,
  createTypeErrorsContext,
  useTypeErrorsContext,
};
