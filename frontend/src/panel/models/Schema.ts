type Schema<R> = Record<keyof R, boolean>;

const getMissingProperties = <I extends object, R extends object>(
  node: I,
  schema: Schema<R>,
): string[] => {
  return Object.keys(schema)
    .filter((key: string) => !(key in node) || node[key as keyof I] === null)
    .map((key) => key as keyof R)
    .filter((key: keyof R) => schema[key])
    .map((key) => key.toString());
};

export { getMissingProperties };
export type { Schema };
