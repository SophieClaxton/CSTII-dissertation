import { useContext } from 'react';
import { EditorProgramContext } from './EditorProgramContext';

const useEditorProgramContext = () => {
  const editorProgramContext = useContext(EditorProgramContext);
  if (!editorProgramContext) {
    throw new Error('No editor program found');
  }
  return editorProgramContext;
};

export { useEditorProgramContext };
