import { createContext, useReducer } from 'react';
import { EditorAction, EditorActionType } from '../models/EditorAction';
import { getEditorComponentById } from '../models/CST/getters';
import { isSection, isSubsection } from '../models/CST/testers';
import {
  mapProgramToProgramWithUpdatedSections,
  mapSectionToSectionWithUpdatedEndStep,
  mapSectionToSectionWithUpdatedInnerSteps,
} from '../models/CST/mappers';
import { UnpublishedScript } from '../models/UnpublishedScript';

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

const unpublishedScriptReducer = (
  unpublishedScript: UnpublishedScript,
  action: EditorAction,
): UnpublishedScript => {
  console.log(`Dispatching to editorProgramReducer action:${action.type}`);
  switch (action.type) {
    case EditorActionType.EditProgramName:
      return {
        ...unpublishedScript,
        title: action.newName,
      };
    case EditorActionType.EditProgramAuthor:
      return {
        ...unpublishedScript,
        author: { ...unpublishedScript.author, name: action.newAuthor },
      };
    case EditorActionType.EditInnerStep: {
      return unpublishedScript;
    }
    case EditorActionType.AddInnerStep: {
      const section = getEditorComponentById(
        unpublishedScript.program,
        action.sectionId,
      );
      if (!section) {
        console.log(`Did not find section with id ${action.sectionId}`);
        console.log(unpublishedScript);
        return unpublishedScript;
      }
      if (!isSection(section) || !isSubsection(section)) {
        console.log(
          `Found a program component with id ${action.sectionId} but it is not a section`,
        );
        return unpublishedScript;
      }
      console.log(`Adding inner step to section ${section.id}`);
      const newEditorProgram = mapProgramToProgramWithUpdatedSections(
        unpublishedScript.program,
        section.id,
        mapSectionToSectionWithUpdatedInnerSteps([
          ...section.innerSteps,
          action.innerStep,
        ]),
      );
      console.log(newEditorProgram);
      return {
        ...unpublishedScript,
        program: newEditorProgram,
      };
    }
    case EditorActionType.DeleteInnerStep:
      return unpublishedScript;
    case EditorActionType.EditEndStep:
      return unpublishedScript;
    case EditorActionType.AddEndStep: {
      const section = getEditorComponentById(
        unpublishedScript.program,
        action.sectionId,
      );
      if (!section) {
        console.log(`Did not find section with id ${action.sectionId}`);
        console.log(unpublishedScript);
        return unpublishedScript;
      }
      if (!isSection(section) || !isSubsection(section)) {
        console.log(
          `Found a program component with id ${action.sectionId} but it is not a section`,
        );
        return unpublishedScript;
      }
      console.log(`Adding end step to section ${section.id}`);
      const newEditorProgram = mapProgramToProgramWithUpdatedSections(
        unpublishedScript.program,
        section.id,
        mapSectionToSectionWithUpdatedEndStep(action.endStep),
      );
      console.log(newEditorProgram);
      return {
        ...unpublishedScript,
        program: newEditorProgram,
      };
    }
    case EditorActionType.DeleteEndStep:
      return unpublishedScript;
    case EditorActionType.ChangeUserDecisionStepToInnerStep:
      return unpublishedScript;
    case EditorActionType.ChangeUserDecisionStepToEndStep:
      return unpublishedScript;
  }
};

export { UnpublishedScriptContext, UnpublishedScriptContextProvider };
