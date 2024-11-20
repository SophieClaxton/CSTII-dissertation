import { ASTProgramNode } from '../../../models/AST';
import DisplaySection from './DisplaySection';

interface DisplayProgramProps {
  program: ASTProgramNode;
}

const DisplayProgram: React.FC<DisplayProgramProps> = ({ program }) => {
  return (
    <div className="program">
      <div className="program-meta-data">
        <h2>{program.name}</h2>
        <h3>{program.author}</h3>
        <h3>{program.dateCreated}</h3>
      </div>
      <div className="program-code">
        <div className="start-block">
          <p>START</p>
        </div>
        <DisplaySection section={program.start} />
      </div>
    </div>
  );
};

export default DisplayProgram;
