import { useNavigationContext } from '../contexts/contextHooks';

const HelperScriptSelector = () => {
  const { removeCurrentScreen } = useNavigationContext();

  return (
    <div className="script-selection-page page">
      <div className="page-title">
        <h1>Your Scripts</h1>
        <button className="back-button" onClick={removeCurrentScreen}>
          Back
        </button>
      </div>
      <div className="all-scripts-container"></div>
    </div>
  );
};

export default HelperScriptSelector;
