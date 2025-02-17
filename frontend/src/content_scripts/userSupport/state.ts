import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { ValidTag } from '../../panel/models/InterfaceElement';
import { LevelOfSupport } from '../../panel/models/UserSupport';

interface EditingState {
  isClickable: boolean;
  stepId: string;
  validTags: ValidTag[];
  url: string;
}

interface SupportState {
  collectStruggleData: boolean;
  userStruggleData: {
    totalDistance: number;
    numMouseClicks: number;
    totalScrollDistance: number;
  };
  intervalId: NodeJS.Timeout | undefined;
  timeoutId: NodeJS.Timeout | undefined;
  levelOfSupport: LevelOfSupport;
  nextPossibleSteps: ASTInstruction[];
  nextStep: ASTInstruction | undefined;
  lastScrollPosition: { x: number; y: number };
  systemScrolling: boolean;
}

export type { EditingState, SupportState };
