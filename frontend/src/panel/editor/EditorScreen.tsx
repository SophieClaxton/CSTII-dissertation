import { UnpublishedScriptContextProvider } from '../contexts/UnpublishedScriptContext';
import '../panel.css';
import './styles/editor.css';
import { useNavigationContext } from '../contexts/contextHooks';
import { getUnpublishedScript } from '../api/unpublishedScripts';
import { assertIsEditorScreen } from '../navigation/screenChecks';
import Loadable from '../components/Loadable';
import ScriptEditor from './components/ScriptEditor';
import Page from '../components/Page';
import { useAPICall } from '../api/apiHooks';

const Editor: React.FC = () => {
  const { currentScreen } = useNavigationContext();
  assertIsEditorScreen(currentScreen);

  const unpublishedScriptData = useAPICall(() =>
    getUnpublishedScript(currentScreen.params.scriptId),
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

export default Editor;
