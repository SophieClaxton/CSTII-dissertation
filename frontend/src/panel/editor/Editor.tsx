import DisplayProgram from './components/DisplayProgram';
import testProgram from './testProgram';
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
      <DisplayProgram program={testProgram} />
    </div>
  );
};

export default Editor;
