import { UnpublishedScriptContextProvider } from '../../contexts/UnpublishedScriptContext';
import { useNavigationContext } from '../../contexts/contextHooks';
import { getUnpublishedScript } from '../../api_temp/unpublishedScripts';
import { assertIsEditorScreen } from '../../navigation/screenChecks';
import Loadable from '../Loadable';
import ScriptEditor from '../../scripting_interface/script_editor/components/ScriptEditor';
import Page from '../Page';
import { useAPICall } from '../../api_temp/apiHooks';
import { useCallback } from 'react';

const EditorPage: React.FC = () => {
  const { currentScreen } = useNavigationContext();
  assertIsEditorScreen(currentScreen);

  const unpublishedScriptData = useAPICall(
    useCallback(
      () => getUnpublishedScript(currentScreen.params.scriptId),
      [currentScreen],
    ),
  );

  return (
    <Page title={'Script Editor'}>
      <Loadable
        response={unpublishedScriptData}
        onLoad={(script) => (
          <UnpublishedScriptContextProvider script={script}>
            <ScriptEditor />
          </UnpublishedScriptContextProvider>
        )}
      />
    </Page>
  );
};

export default EditorPage;
