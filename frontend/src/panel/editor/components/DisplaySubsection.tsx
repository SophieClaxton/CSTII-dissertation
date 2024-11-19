import { ASTSubsectionNode } from '../../models/Program';
import DisplayStep from './DisplayStep';

interface DisplaySubsectionProps {
  subsection: ASTSubsectionNode;
}

const DisplaySubsection: React.FC<DisplaySubsectionProps> = ({ subsection }) => {
  return (
    <div className="subsection">
      <DisplayStep step={subsection.start} />
    </div>
  );
};

export default DisplaySubsection;
