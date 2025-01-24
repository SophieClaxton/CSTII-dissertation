import { useCallback } from 'react';
import { sendEndSupportMessage } from '../../../common/sendMessage';
import { useAPICall } from '../../api/apiHooks';
import { getScript } from '../../api/scripts';
import Loadable from '../../components/Loadable';
import Page from '../../components/Page';
import {
  useNavigationContext,
  useTabContext,
} from '../../contexts/contextHooks';
import { assertIsScriptSupportScreen } from '../../navigation/screenChecks';
import ScriptSupport from './ScriptSupport';

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
    <Page title={'Get Support'} onBack={() => sendEndSupportMessage(tab.id!)}>
      <Loadable
        response={scriptData}
        onLoad={(script) => <ScriptSupport script={script} />}
      />
    </Page>
  );
};

export default ScriptSupportPage;
