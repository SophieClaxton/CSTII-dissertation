import XarrowProgramFlow from './components/CST/ProgramFlow';
import { UnpublishedScriptContextProvider } from './contexts/UnpublishedScriptContext';
import './styles/editor.css';

interface EditorProps {
  goHome: () => void;
}

const Editor: React.FC<EditorProps> = ({ goHome }) => {
  return (
    <div className="editor">
      <div className="editor-title">
        <h1>Program Editor</h1>
        <button className="back-button" onClick={goHome}>
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
