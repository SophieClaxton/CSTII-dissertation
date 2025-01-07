import { createContext } from 'react';
import { ScreenType } from '../../models/ScreenType';

interface ScreenContextState {
  getCurrentScreen: () => ScreenType | undefined;
  removeCurrentScreen: () => void;
  addScreen: (screen: ScreenType) => void;
}

const ScreenContext = createContext<ScreenContextState | undefined>(undefined);

export { ScreenContext };
export type { ScreenContextState };
