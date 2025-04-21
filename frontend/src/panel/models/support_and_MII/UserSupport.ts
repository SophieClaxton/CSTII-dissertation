const levelsOfSupport = ['text', 'overlay', 'click'] as const;
type LevelOfSupport = (typeof levelsOfSupport)[number];

interface UserStruggleData {
  totalDistance: number;
  numMouseClicks: number;
  totalScrollDistance: number;
}

type UserStruggleEvidence = UserStruggleData & {
  stepsCompleted: number;
};

type StruggleProbModel = (data: UserStruggleData) => number;

export { levelsOfSupport };
export type {
  LevelOfSupport,
  UserStruggleData,
  UserStruggleEvidence,
  StruggleProbModel,
};
