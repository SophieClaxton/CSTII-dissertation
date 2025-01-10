const getMissingProperties = <I extends object, R extends object>(
  node: I,
  schema: Record<keyof R, boolean>,
): string[] => {
  return Object.keys(schema)
    .filter((key: string) => !(key in node) || node[key as keyof I] === null)
    .map((key) => key as keyof R)
    .filter((key: keyof R) => schema[key])
    .map((key) => `Missing ${key.toString()}`);
};

export { getMissingProperties };
