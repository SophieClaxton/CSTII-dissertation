import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse, { ErrorResponse } from '../../models/APIResponse';
import Loadable from '../../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from './ScriptListItem';
import { WebsiteWithScripts } from '../../models/Website';
import { getWebsite } from '../../api/websites';
import './styles/scriptSelectionPage.css';

const UserScriptSelectionPage = () => {
  const { currentParam, removeCurrentParam, removeCurrentScreen } =
    useNavigationContext();

  const [websiteData, setWebsiteData] = useState<
    APIResponse<WebsiteWithScripts>
  >({ status: 'Loading' });

  useEffect(() => {
    const getData = async () => {
      const idError: ErrorResponse = {
        status: 'Error',
        error: { type: 'Unknown', message: 'No website id found' },
      };
      const response = currentParam ? await getWebsite(currentParam) : idError;
      setWebsiteData(response);
    };
    getData();
  });

  return (
    <Loadable
      response={websiteData}
      onLoad={(website) => (
        <div className="script-selection-page page">
          <div className="page-title">
            <h1>Select a Script from {website.url}</h1>
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
          <div className="all-scripts-container">
            <List className="script-list">
              {website.scripts.map((script) => (
                <ScriptListItem script={script} />
              ))}
            </List>
          </div>
        </div>
      )}
    />
  );
};

export default UserScriptSelectionPage;
