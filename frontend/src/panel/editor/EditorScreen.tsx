import { UnpublishedScriptContextProvider } from '../contexts/UnpublishedScriptContext';
import '../panel.css';
import './styles/editor.css';
import { useNavigationContext } from '../contexts/contextHooks';
import { useEffect, useState } from 'react';
import APIResponse from '../models/API/APIResponse';
import { getUnpublishedScript } from '../api/unpublishedScripts';
import { UnpublishedScript } from '../models/API/UnpublishedScript';
import { assertIsEditorScreen } from '../navigation/screenChecks';
import Loadable from '../components/Loadable';
import ScriptEditor from './components/ScriptEditor';
import Page from '../components/Page';

const Editor: React.FC = () => {
  const { currentScreen } = useNavigationContext();
  assertIsEditorScreen(currentScreen);

  const [unpublishedScriptData, setUnpublishedScriptData] = useState<
    APIResponse<UnpublishedScript>
  >({ status: 'Loading' });

  useEffect(() => {
    const getUnpublishedScriptData = async () => {
      const response = await getUnpublishedScript(
        currentScreen.params.scriptId,
      );
      setUnpublishedScriptData(response);
    };
    getUnpublishedScriptData();
  }, [currentScreen]);

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
