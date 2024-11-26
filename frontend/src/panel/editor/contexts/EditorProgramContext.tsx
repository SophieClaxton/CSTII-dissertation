import { createContext, useContext, useReducer } from 'react';
import { EditorProgram } from '../../models/programComponent/ProgramComponent';
import testEditorProgram from '../consts/testEditorProgram';
import { EditorAction, EditorReducerActionType } from '../../models/EditorReducerActions';

interface EditorProgramState {
  editorProgram: EditorProgram;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorProgramContext = createContext<EditorProgramState | undefined>(undefined);

const useEditorProgramContext = () => {
  const editorProgramContext = useContext(EditorProgramContext);
  if (!editorProgramContext) {
    throw new Error('No editor program found');
  }
  return editorProgramContext;
};

const EditorProgramContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [editorProgram, dispatch] = useReducer(editorProgramReducer, testEditorProgram);
  return (
    <EditorProgramContext.Provider value={{ editorProgram: editorProgram, dispatch: dispatch }}>
      {children}
    </EditorProgramContext.Provider>
  );
};

const editorProgramReducer = (editorProgram: EditorProgram, action: EditorAction): EditorProgram => {
  switch (action.type) {
    case EditorReducerActionType.EditProgramName:
      return {
        ...editorProgram,
        name: action.newName,
      };
    case EditorReducerActionType.EditProgramAuthor:
      return {
        ...editorProgram,
        author: action.newAuthor,
      };
    case EditorReducerActionType.EditInnerStep:
      return editorProgram;
    case EditorReducerActionType.AddInnerStep:
      return editorProgram;
    case EditorReducerActionType.DeleteInnerStep:
      return editorProgram;
    case EditorReducerActionType.EditEndStep:
      return editorProgram;
    case EditorReducerActionType.AddEndStep:
      return editorProgram;
    case EditorReducerActionType.DeleteEndStep:
      return editorProgram;
    case EditorReducerActionType.ChangeUserDecisionStepToInnerStep:
      return editorProgram;
    case EditorReducerActionType.ChangeUserDecisionStepToEndStep:
      return editorProgram;
  }
};

export { EditorProgramContext, useEditorProgramContext, EditorProgramContextProvider };
