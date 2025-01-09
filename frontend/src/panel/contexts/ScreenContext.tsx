import { createContext } from 'react';
import { PanelScreen } from '../navigation/ScreenType';

interface ScreenContextState {
  screenStack: PanelScreen[];
  setScreenStack: (value: PanelScreen[]) => void;
}

interface NavigationContext {
  currentScreen: PanelScreen | undefined;
  goBack: () => void;
  goTo: (screen: PanelScreen) => void;
}

const ScreenContext = createContext<ScreenContextState | undefined>(undefined);

export { ScreenContext };
export type { ScreenContextState, NavigationContext };
