import { ASTSectionNode } from '../../../models/AST/AST';
import DisplayStep from './DisplayStep';

interface DisplaySectionProps {
  section: ASTSectionNode;
}

const DisplaySection: React.FC<DisplaySectionProps> = ({ section }) => {
  return (
    <div className="section">
      <div className="section-meta-data">
        <p>{section.url}</p>
      </div>
      <DisplayStep step={section.start} />
    </div>
  );
};

export default DisplaySection;
