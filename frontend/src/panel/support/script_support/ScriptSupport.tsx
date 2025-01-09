import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse from '../../models/APIResponse';
import { Script } from '../../models/Script';
import { getScript } from '../../api/scripts';
import { assertIsScriptSupportScreen } from '../../navigation/screenChecks';

const ScriptSupport: React.FC = () => {
  const { currentScreen, goBack } = useNavigationContext();
  assertIsScriptSupportScreen(currentScreen);

  const [scriptData, setScriptData] = useState<APIResponse<Script>>({
    status: 'Loading',
  });

  useEffect(() => {
    const getData = async () => {
      const response = await getScript(currentScreen.params.scriptId);
      setScriptData(response);
    };
    getData();
  }, [currentScreen]);

  const content =
    scriptData.status === 'Loading' ? (
      <div>Loading...</div>
    ) : scriptData.status === 'Error' ? (
      <div>Error: {scriptData.error.message}</div>
    ) : (
      <div>
        <h1>Script: {scriptData.data.title}</h1>
      </div>
    );

  return (
    <div className="script-support page">
      <div className="page-title">
        <button className="back-button" onClick={() => goBack}>
          Back
        </button>
      </div>
      {content}
    </div>
  );
};

export default ScriptSupport;
