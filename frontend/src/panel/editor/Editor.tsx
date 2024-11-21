import XarrowProgramFlow from './components/EditorNode/ProgramFlow';
import { EditorProgramContextProvider } from './contexts/EditorProgramContext';
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
      <EditorProgramContextProvider>
        <XarrowProgramFlow />
      </EditorProgramContextProvider>
    </div>
  );
};

export default Editor;
