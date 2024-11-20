import { EditorProgram } from '../../../models/ProgramComponent';
import Section from './Section';
import '../../styles/program.css';

interface ProgramProps {
  program: EditorProgram;
}

const Program: React.FC<ProgramProps> = ({ program }) => {
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
        {program.sections.map((section) => (
          <Section section={section} />
        ))}
      </div>
    </div>
  );
};

export default Program;
