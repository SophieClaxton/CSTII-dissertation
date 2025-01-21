import { createContext } from 'react';
import { PanelScreen } from '../navigation/ScreenType';
import { StateSetter } from '../models/utilTypes';

interface ScreenContextState {
  screenStack: PanelScreen[];
  setScreenStack: StateSetter<PanelScreen[]>;
}

interface NavigationContext {
  currentScreen: PanelScreen | undefined;
  goBack: () => void;
  goTo: (screen: PanelScreen) => void;
}

const ScreenContext = createContext<ScreenContextState | undefined>(undefined);

export { ScreenContext };
export type { ScreenContextState, NavigationContext };
