import { createContext, useReducer } from 'react';
import { EditorAction } from '../models/EditorAction';
import { UnpublishedScript } from '../models/API/UnpublishedScript';
import { unpublishedScriptReducer } from '../unpublishedScriptReducer/unpublishedScriptReducer';

interface UnpublishedScriptState {
  unpublishedScript: UnpublishedScript;
  dispatch: React.Dispatch<EditorAction>;
}

const UnpublishedScriptContext = createContext<
  UnpublishedScriptState | undefined
>(undefined);

const UnpublishedScriptContextProvider: React.FC<
  React.PropsWithChildren & { script: UnpublishedScript }
> = ({ children, script }) => {
  const [editorProgram, dispatch] = useReducer(
    unpublishedScriptReducer,
    script,
  );
  return (
    <UnpublishedScriptContext.Provider
      value={{ unpublishedScript: editorProgram, dispatch: dispatch }}
    >
      {children}
    </UnpublishedScriptContext.Provider>
  );
};

export { UnpublishedScriptContext, UnpublishedScriptContextProvider };
