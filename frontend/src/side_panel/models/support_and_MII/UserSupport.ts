const levelsOfSupport = ['text', 'overlay', 'click'] as const;
type LevelOfSupport = (typeof levelsOfSupport)[number];

interface ScriptLocation {
  stepNumber: number;
  decisionHistory: ('yes' | 'no')[];
}

const mapScriptLocationToString = (location: ScriptLocation): string => {
  return `${location.stepNumber}|${location.decisionHistory.join('-')}`;
};

interface UserStruggleData {
  totalDistance: number;
  numMouseClicks: number;
  totalScrollDistance: number;
}

type UserStruggleEvidence = UserStruggleData & {
  stepsCompleted: number;
};

type StruggleProbModel = (data: UserStruggleData) => number;

export { levelsOfSupport, mapScriptLocationToString };
export type {
  LevelOfSupport,
  ScriptLocation,
  UserStruggleData,
  UserStruggleEvidence,
  StruggleProbModel,
};
