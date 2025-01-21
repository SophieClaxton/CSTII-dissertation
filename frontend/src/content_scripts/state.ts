import { ASTStepNodeInfo } from '../panel/models/AST/AST';
import { SelectableTag } from '../panel/models/InterfaceElement';
import { LevelOfSupport } from '../panel/support/script_support/userSupportMII';

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
  levelOfSupport: LevelOfSupport;
  nextPossibleSteps: ASTStepNodeInfo[];
  lastScrollPosition: { x: number; y: number };
}

export type { EditingState, SupportState };
