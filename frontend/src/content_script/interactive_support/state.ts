import { ASTInstruction } from '../../side_panel/models/AST/Instruction';
import { ValidTag } from '../../side_panel/models/interface_element/validTags';
import {
  LevelOfSupport,
  InteractionData,
} from '../../side_panel/models/support_and_MII/UserSupport';

interface EditingState {
  isClickable: boolean;
  stepId: string;
  validTags: ValidTag[];
  url: string;
}

interface SupportState {
  collectInteractionData: boolean;
  interactionData: InteractionData;
  intervalId: NodeJS.Timeout | undefined;
  timeoutId: NodeJS.Timeout | undefined;
  levelOfSupport: LevelOfSupport;
  nextPossibleSteps: ASTInstruction[];
  lastScrollPosition: { x: number; y: number };
  systemScrolling: boolean;
}

export type { EditingState, SupportState };
