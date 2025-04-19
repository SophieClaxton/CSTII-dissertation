const softmax = (items: number[]): number[] => {
  const exps = items.map(Math.exp);
  const total = exps.reduce((prev, curr) => prev + curr, 0);
  return exps.map((item) => item / total);
};

export { softmax };
