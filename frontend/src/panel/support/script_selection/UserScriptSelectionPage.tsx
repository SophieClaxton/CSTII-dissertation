import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse, { ErrorResponse } from '../../models/APIResponse';
import Loadable from '../../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from './ScriptListItem';
import './styles/scriptSelectionPage.css';
import { getPublicUser } from '../../api/users';
import { PublicUserWithScripts } from '../../models/User';

const UserScriptSelectionPage = () => {
  const { currentParam, removeCurrentParam, removeCurrentScreen } =
    useNavigationContext();

  const [publicUserData, setPublicUserData] = useState<
    APIResponse<PublicUserWithScripts>
  >({ status: 'Loading' });

  useEffect(() => {
    const getData = async () => {
      const idError: ErrorResponse = {
        status: 'Error',
        error: { type: 'Unknown', message: 'No user id found' },
      };
      const response = currentParam
        ? await getPublicUser(currentParam)
        : idError;
      setPublicUserData(response);
    };
    getData();
  });

  return (
    <Loadable
      response={publicUserData}
      onLoad={(user) => (
        <div className="script-selection-page page">
          <div className="page-title">
            <h1>Select a Script from {user.name}</h1>
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
              {user.scripts.map((script) => (
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
