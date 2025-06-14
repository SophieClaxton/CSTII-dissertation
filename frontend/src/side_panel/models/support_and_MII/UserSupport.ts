const levelsOfSupport = ['text', 'hints', 'auto'] as const;
type LevelOfSupport = (typeof levelsOfSupport)[number];

interface WorkflowLocation {
  stepNumber: number;
  decisionHistory: ('yes' | 'no')[];
}

const mapWorkflowLocationToString = (location: WorkflowLocation): string => {
  return `${location.stepNumber}|${location.decisionHistory.join('-')}`;
};

interface InteractionData {
  totalDistance: number;
  numMouseClicks: number;
  totalScrollDistance: number;
}

type UserStruggleEvidence = InteractionData & {
  stepsCompleted: number;
  timeSinceInteraction: number;
  levelOfSupport: LevelOfSupport;
};

type StruggleProbModel = (data: InteractionData) => number;

export { levelsOfSupport, mapWorkflowLocationToString };
export type {
  LevelOfSupport,
  WorkflowLocation,
  InteractionData,
  UserStruggleEvidence,
  StruggleProbModel,
};
