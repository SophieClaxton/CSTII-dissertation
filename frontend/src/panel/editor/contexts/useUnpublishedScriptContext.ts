import { useContext } from 'react';
import { UnpublishedScriptContext } from './UnpublishedScriptContext';

const useUnpublishedScriptContext = () => {
  const editorProgramContext = useContext(UnpublishedScriptContext);
  if (!editorProgramContext) {
    throw new Error('No editor program found');
  }
  return editorProgramContext;
};

export { useUnpublishedScriptContext };
