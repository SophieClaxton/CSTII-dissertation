import { useScreenContext } from '../../editor/contexts/contextHooks';
import '../../panel.css';

const ScriptSelectionPage: React.FC = () => {
  const { removeCurrentScreen } = useScreenContext();
  return (
    <div className="script-selection-page page">
      <div className="page-title">
        <h1>Select a Script</h1>
        <button className="back-button" onClick={removeCurrentScreen}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ScriptSelectionPage;
