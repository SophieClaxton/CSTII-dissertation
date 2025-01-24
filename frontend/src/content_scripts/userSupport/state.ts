import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { SelectableTag } from '../../panel/models/InterfaceElement';
import { LevelOfSupport } from '../../panel/support/script_support/userStruggleSupport/userSupportMII';

interface EditingState {
  isClickable: boolean;
  stepId: string;
  validTags: SelectableTag[];
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
  lastScrollPosition: { x: number; y: number };
  systemScrolling: boolean;
}

export type { EditingState, SupportState };
