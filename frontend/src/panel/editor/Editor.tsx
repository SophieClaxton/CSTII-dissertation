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
import ProgramFlow from './components/ProgramFlow';

const Editor: React.FC = () => {
  const { goBack, currentScreen } = useNavigationContext();
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
    <div className="editor page">
      <div className="page-title">
        <h1>Program Editor</h1>
        <button className="back-button" onClick={goBack}>
          Back
        </button>
      </div>
      <Loadable
        response={unpublishedScriptData}
        onLoad={(script) => (
          <UnpublishedScriptContextProvider script={script}>
            <ProgramFlow />
          </UnpublishedScriptContextProvider>
        )}
      />
    </div>
  );
};

export default Editor;
