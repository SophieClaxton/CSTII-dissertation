import { createContext, useReducer } from 'react';
import { EditorProgram } from '../../models/programComponent/ProgramComponent';
import testEditorProgram from '../consts/testEditorProgram';
import {
  EditorAction,
  EditorReducerActionType,
} from '../../models/EditorReducerActions';
import { getEditorComponentById } from '../../models/programComponent/getters';
import { isSection, isSubsection } from '../../models/programComponent/testers';
import {
  mapProgramToProgramWithUpdatedSections,
  mapSectionToSectionWithUpdatedEndStep,
  mapSectionToSectionWithUpdatedInnerSteps,
} from '../../models/programComponent/mappers';

interface EditorProgramState {
  editorProgram: EditorProgram;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorProgramContext = createContext<EditorProgramState | undefined>(
  undefined,
);

const EditorProgramContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [editorProgram, dispatch] = useReducer(
    editorProgramReducer,
    testEditorProgram,
  );
  return (
    <EditorProgramContext.Provider
      value={{ editorProgram: editorProgram, dispatch: dispatch }}
    >
      {children}
    </EditorProgramContext.Provider>
  );
};

const editorProgramReducer = (
  editorProgram: EditorProgram,
  action: EditorAction,
): EditorProgram => {
  console.log(`Dispatching to editorProgramReducer action:${action.type}`);
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
    case EditorReducerActionType.EditInnerStep: {
      return editorProgram;
    }
    case EditorReducerActionType.AddInnerStep: {
      const section = getEditorComponentById(editorProgram, action.sectionId);
      if (!section) {
        console.log(`Did not find section with id ${action.sectionId}`);
        console.log(editorProgram);
        return editorProgram;
      }
      if (!isSection(section) || !isSubsection(section)) {
        console.log(
          `Found a program component with id ${action.sectionId} but it is not a section`,
        );
        return editorProgram;
      }
      console.log(`Adding inner step to section ${section.id}`);
      const newEditorProgram = mapProgramToProgramWithUpdatedSections(
        editorProgram,
        section.id,
        mapSectionToSectionWithUpdatedInnerSteps([
          ...section.innerSteps,
          action.innerStep,
        ]),
      );
      console.log(newEditorProgram);
      return newEditorProgram;
    }
    case EditorReducerActionType.DeleteInnerStep:
      return editorProgram;
    case EditorReducerActionType.EditEndStep:
      return editorProgram;
    case EditorReducerActionType.AddEndStep: {
      const section = getEditorComponentById(editorProgram, action.sectionId);
      if (!section) {
        console.log(`Did not find section with id ${action.sectionId}`);
        console.log(editorProgram);
        return editorProgram;
      }
      if (!isSection(section) || !isSubsection(section)) {
        console.log(
          `Found a program component with id ${action.sectionId} but it is not a section`,
        );
        return editorProgram;
      }
      console.log(`Adding end step to section ${section.id}`);
      const newEditorProgram = mapProgramToProgramWithUpdatedSections(
        editorProgram,
        section.id,
        mapSectionToSectionWithUpdatedEndStep(action.endStep),
      );
      console.log(newEditorProgram);
      return newEditorProgram;
    }
    case EditorReducerActionType.DeleteEndStep:
      return editorProgram;
    case EditorReducerActionType.ChangeUserDecisionStepToInnerStep:
      return editorProgram;
    case EditorReducerActionType.ChangeUserDecisionStepToEndStep:
      return editorProgram;
  }
};

export { EditorProgramContext, EditorProgramContextProvider };
