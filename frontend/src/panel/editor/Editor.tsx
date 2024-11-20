import ProgramFlow from './components/node/ProgramFlow';
import testEditorProgram from './consts/testEditorProgram';
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
      {/* <DisplayProgram program={testASTProgram} /> */}
      <ProgramFlow program={testEditorProgram} />
    </div>
  );
};

export default Editor;
