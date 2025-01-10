import { createContext } from 'react';

const TypeErrorsContext = createContext<Map<string, string> | undefined>(
  undefined,
);

export { TypeErrorsContext };
