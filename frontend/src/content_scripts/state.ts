import { ASTStepNodeInfo } from "../panel/models/AST/AST";
import { SelectableTag } from "../panel/models/InterfaceElement";

interface EditingState {
  isClickable: boolean;
  stepId: string;
  validTags: SelectableTag[];
  url: string;
}

interface SupportState {
  collectStruggleData: boolean,
  userStruggleData: {
    totalDistance: number,
    numMouseClicks: number,
    totalScrollDistance: number,
  },
  intervalId: NodeJS.Timeout | undefined,
  nextPossibleSteps: ASTStepNodeInfo[],
  lastScrollPosition: {x: number, y: number};
}

export type { EditingState, SupportState };
