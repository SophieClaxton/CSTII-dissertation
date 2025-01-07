import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import '../../panel.css';
import APIResponse from '../../models/APIResponse';
import { ScriptWithAuthorAndWebsite } from '../../models/Script';
import { getScripts } from '../../api/scripts';
import ScriptListItem from './ScriptListItem';
import './styles/scriptSelectionPage.css';

const ScriptSelectionPage: React.FC = () => {
  const { removeCurrentScreen } = useNavigationContext();
  const [scriptsData, setScriptsData] = useState<
    APIResponse<ScriptWithAuthorAndWebsite[]>
  >({ status: 'Loading' });

  useEffect(() => {
    const getData = async () => {
      const response = await getScripts();
      setScriptsData(response);
    };
    getData();
  }, [setScriptsData]);

  const scriptsContent =
    scriptsData.status === 'Loading' ? (
      <div>Loading...</div>
    ) : scriptsData.status === 'Error' ? (
      <div>{scriptsData.error.message}</div>
    ) : (
      <>
        {scriptsData.data.map((script) => (
          <ScriptListItem script={script} />
        ))}
      </>
    );

  return (
    <div className="script-selection-page page">
      <div className="page-title">
        <h1>Select a Script</h1>
        <button className="back-button" onClick={removeCurrentScreen}>
          Back
        </button>
      </div>
      <div className="all-scripts-container">{scriptsContent}</div>
    </div>
  );
};

export default ScriptSelectionPage;
