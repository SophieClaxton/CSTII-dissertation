import { Script } from '../../../models/Script';
import DisplaySection from './DisplaySection';

interface DisplayScript {
  program: Script;
}

const DisplayScript: React.FC<DisplayScript> = ({ program: script }) => {
  return (
    <div className="program">
      <div className="program-meta-data">
        <h2>{script.title}</h2>
        <h3>{script.author.name}</h3>
        <h3>{script.created_at.toLocaleDateString()}</h3>
      </div>
      <div className="program-code">
        <div className="start-block">
          <p>START</p>
        </div>
        <DisplaySection section={script.program.start} />
      </div>
    </div>
  );
};

export default DisplayScript;
