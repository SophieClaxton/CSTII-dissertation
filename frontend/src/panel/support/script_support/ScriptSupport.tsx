import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse from '../../models/API/APIResponse';
import { Script } from '../../models/API/Script';
import { getScript } from '../../api/scripts';
import { assertIsScriptSupportScreen } from '../../navigation/screenChecks';
import Page from '../../components/Page';

const ScriptSupport: React.FC = () => {
  const { currentScreen } = useNavigationContext();
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

  return <Page title={'Get Support'}>{content}</Page>;
};

export default ScriptSupport;
