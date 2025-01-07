import { createContext } from 'react';
import { ScreenType } from '../models/ScreenType';

interface ScreenContextState {
  screenStack: ScreenType[];
  setScreenStack: (value: ScreenType[]) => void;
  paramStack: number[];
  setParamStack: (value: number[]) => void;
}

interface NavigationContext {
  currentScreen: ScreenType | undefined;
  removeCurrentScreen: () => void;
  addScreen: (screen: ScreenType) => void;
  currentParam: number | undefined;
  removeCurrentParam: () => void;
  addParam: (id: number) => void;
}

const ScreenContext = createContext<ScreenContextState | undefined>(undefined);

export { ScreenContext };
export type { ScreenContextState, NavigationContext };
