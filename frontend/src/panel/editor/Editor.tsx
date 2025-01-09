import XarrowProgramFlow from './components/CST/ProgramFlow';
import { UnpublishedScriptContextProvider } from '../contexts/UnpublishedScriptContext';
import '../panel.css';
import './styles/editor.css';
import { useNavigationContext } from '../contexts/contextHooks';

const Editor: React.FC = () => {
  const { goBack } = useNavigationContext();
  return (
    <div className="editor page">
      <div className="page-title">
        <h1>Program Editor</h1>
        <button className="back-button" onClick={goBack}>
          Back
        </button>
      </div>
      <UnpublishedScriptContextProvider>
        <XarrowProgramFlow />
      </UnpublishedScriptContextProvider>
    </div>
  );
};

export default Editor;
