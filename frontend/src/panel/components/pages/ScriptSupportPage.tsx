import { useCallback } from 'react';
import { sendEndSupportMessage } from '../../../messaging/sendMessage';
import { useAPICall } from '../../api_temp/apiHooks';
import { getScript } from '../../api_temp/scripts';
import Loadable from '../Loadable';
import Page from '../Page';
import {
  useNavigationContext,
  useTabContext,
} from '../../contexts/contextHooks';
import { assertIsScriptSupportScreen } from '../../navigation/screenChecks';
import ScriptSupport from '../../support_interface/script_support/ScriptSupport';

const ScriptSupportPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsScriptSupportScreen(currentScreen);

  const { tab } = useTabContext();
  const scriptData = useAPICall(
    useCallback(
      () => getScript(currentScreen.params.scriptId),
      [currentScreen],
    ),
  );

  return (
    <Page title={'Get Support'} onBack={() => sendEndSupportMessage(tab.id)}>
      <Loadable
        response={scriptData}
        onLoad={(script) => <ScriptSupport script={script} />}
      />
    </Page>
  );
};

export default ScriptSupportPage;
