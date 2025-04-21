import { createContext } from 'react';

interface SyntaxErrorsInfo {
  errorsMap: Map<string, string>;
  showSyntaxErrors: boolean;
}

const SyntaxErrorsContext = createContext<SyntaxErrorsInfo>({
  errorsMap: new Map(),
  showSyntaxErrors: false,
});

export { SyntaxErrorsContext };
export type { SyntaxErrorsInfo };
