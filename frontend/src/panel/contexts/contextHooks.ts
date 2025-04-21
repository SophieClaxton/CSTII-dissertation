import { useContext } from 'react';
import { UnpublishedScriptContext } from './UnpublishedScriptContext';
import {
  NavigationContext,
  ScreenContext,
  ScreenContextState,
} from './ScreenContext';
import { PanelScreen } from '../navigation/ScreenType';
import { SyntaxErrorsContext, SyntaxErrorsInfo } from './SyntaxErrorsContext';
import { mapIdToString } from '../scripting_interface/unpublished_script_reducer/mappers/nodeIds';
import TabContext from './TabContext';
import { SyntaxCheckError, SyntaxCheckResult } from '../models/SyntaxCheck';
import {
  AnnotationsContex,
  AnnotationsContextInfo,
} from './AnnotationsContext';
import Annotation from '../models/api/Annotation';
import { mapScriptLocationToStepId } from '../scripting_interface/script_editor/script_utils/annotationUtils';
import { CSTProgram } from '../models/CST/CST';

const useUnpublishedScriptContext = () => {
  const editorProgramContext = useContext(UnpublishedScriptContext);
  if (!editorProgramContext) {
    throw new Error('No editor program found');
  }
  return editorProgramContext;
};

const useNavigationContext = () => {
  const screenContext = useContext(ScreenContext);
  if (!screenContext) {
    console.log('No screen context found');
    throw new Error('No screen context is loaded');
  }
  return getNavigationContext(screenContext);
};

const getNavigationContext = ({
  screenStack,
  setScreenStack,
}: ScreenContextState): NavigationContext => {
  const [topScreen, ...bottomScreens] = screenStack;

  return {
    currentScreen: screenStack.length > 0 ? topScreen : undefined,
    goBack: () =>
      screenStack.length > 0 ? setScreenStack(bottomScreens) : undefined,
    goTo: (screen: PanelScreen) => setScreenStack([screen, ...screenStack]),
  };
};

const createSyntaxErrorsContext = (
  syntaxCheckResult: SyntaxCheckResult,
  showSyntaxErrors: boolean,
): SyntaxErrorsInfo => {
  const syntaxErrorsMap = new Map<string, string>();
  if (syntaxCheckResult.success) {
    return { errorsMap: syntaxErrorsMap, showSyntaxErrors };
  }
  syntaxCheckResult.errors.forEach((error: SyntaxCheckError) => {
    const location = mapIdToString(error.location);
    if (!syntaxErrorsMap.has(location)) {
      syntaxErrorsMap.set(location, error.reason);
    } else {
      const prior_reasons = syntaxErrorsMap.get(location);
      syntaxErrorsMap.set(location, `${prior_reasons}, ${error.reason}`);
    }
  });
  return { errorsMap: syntaxErrorsMap, showSyntaxErrors };
};

const useSyntaxErrorsContext = () => {
  const syntaxErrorContext = useContext(SyntaxErrorsContext);
  if (!syntaxErrorContext) {
    throw new Error('No syntax errors context found');
  }
  return syntaxErrorContext;
};

const useTabContext = () => {
  const tabContext = useContext(TabContext);
  if (!tabContext || tabContext.tab === undefined) {
    console.log(tabContext);
    throw new Error('No tab errors context found');
  }
  return { tab: tabContext.tab };
};

const createAnnotationsContext = (
  annotations: Annotation[],
  program: CSTProgram,
  showAnnotations: boolean,
): AnnotationsContextInfo => {
  const annotationsMap = new Map();
  for (const annotation of annotations) {
    const stepId = mapScriptLocationToStepId(annotation.location, program);
    annotationsMap.set(mapIdToString(stepId), annotation.description);
  }
  return { annotationsMap, showAnnotations };
};

const useAnnotationsContext = () => {
  const annotationsContext = useContext(AnnotationsContex);
  if (!annotationsContext) {
    throw new Error('No annotations context found');
  }
  return annotationsContext;
};

export {
  useUnpublishedScriptContext,
  useNavigationContext,
  createSyntaxErrorsContext,
  useSyntaxErrorsContext,
  useTabContext,
  createAnnotationsContext,
  useAnnotationsContext,
};
