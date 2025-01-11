import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse from '../../models/API/APIResponse';
import Loadable from '../../components/Loadable';
import List from '@mui/material/List/List';
import ScriptListItem from './ScriptListItem';
import './styles/scriptSelectionPage.css';
import { getPublicUser } from '../../api/users';
import { PublicUserWithScripts } from '../../models/API/User';
import { assertIsUserScriptSelectorScreen } from '../../navigation/screenChecks';

const UserScriptSelectionPage = () => {
  const { currentScreen, goBack } = useNavigationContext();
  assertIsUserScriptSelectorScreen(currentScreen);

  const [publicUserData, setPublicUserData] = useState<
    APIResponse<PublicUserWithScripts>
  >({ status: 'Loading' });

  useEffect(() => {
    const getData = async () => {
      const response = await getPublicUser(currentScreen.params.userId);
      setPublicUserData(response);
    };
    getData();
  }, [currentScreen]);

  return (
    <Loadable
      response={publicUserData}
      onLoad={(user) => (
        <div className="script-selection-page page">
          <div className="page-title">
            <h1>Select a Script from {user.name}</h1>
            <button className="back-button" onClick={goBack}>
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
