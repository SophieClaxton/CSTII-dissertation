import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse, { ErrorResponse } from '../../models/APIResponse';
import { Script } from '../../models/Script';
import { getScript } from '../../api/scripts';

const ScriptSupport: React.FC = () => {
  const { currentParam, removeCurrentScreen, removeCurrentParam } =
    useNavigationContext();
  const [scriptData, setScriptData] = useState<APIResponse<Script>>({
    status: 'Loading',
  });

  useEffect(() => {
    const getData = async () => {
      const idError: ErrorResponse = {
        status: 'Error',
        error: { type: 'Unknown', message: 'No script id found' },
      };
      const response = currentParam ? await getScript(currentParam) : idError;
      setScriptData(response);
    };
    getData();
  }, [currentParam, setScriptData]);

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
        <button
          className="back-button"
          onClick={() => {
            removeCurrentParam();
            removeCurrentScreen();
          }}
        >
          Back
        </button>
      </div>
      {content}
    </div>
  );
};

export default ScriptSupport;
