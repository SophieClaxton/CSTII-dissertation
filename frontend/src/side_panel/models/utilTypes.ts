type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type StateRef<T> = React.MutableRefObject<T>;

type MappedOmit<T, K extends string> = T extends object ? Omit<T, K> : never;

export type { StateSetter, StateRef, MappedOmit };
