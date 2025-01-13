import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse from '../../models/API/APIResponse';
import Loadable from '../../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from './ScriptListItem';
import { WebsiteWithScripts } from '../../models/API/Website';
import { getWebsite } from '../../api/websites';
import './styles/scriptSelectionPage.css';
import { assertIsWebsiteScriptSelectorScreen } from '../../navigation/screenChecks';
import Page from '../../components/Page';

const UserScriptSelectionPage = () => {
  const { currentScreen } = useNavigationContext();
  assertIsWebsiteScriptSelectorScreen(currentScreen);

  const [websiteData, setWebsiteData] = useState<
    APIResponse<WebsiteWithScripts>
  >({ status: 'Loading' });

  useEffect(() => {
    const getData = async () => {
      const response = await getWebsite(currentScreen.params.websiteId);
      setWebsiteData(response);
    };
    getData();
  }, [currentScreen]);

  return (
    <Loadable
      response={websiteData}
      onLoad={(website) => (
        <Page title={`Scripts for ${website.url}`}>
          <div className="all-scripts-container">
            <List className="script-list">
              {website.scripts.map((script) => (
                <ScriptListItem script={script} />
              ))}
            </List>
          </div>
        </Page>
      )}
    />
  );
};

export default UserScriptSelectionPage;
