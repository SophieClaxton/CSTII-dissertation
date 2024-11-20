import { ASTNodeType, ASTPlaceholderNode, ASTSectionNode } from '../../models/AST';
import DisplayStep from './DisplayStep';

interface DisplaySectionProps {
  section: ASTSectionNode | ASTPlaceholderNode;
}

const DisplaySection: React.FC<DisplaySectionProps> = ({ section }) => {
  if (section.type === ASTNodeType.Placeholder) {
    return <></>;
  }
  return (
    <div className="section">
      <div className="section-meta-data">
        {section.name && <p>{section.name}</p>}
        <p>{section.url}</p>
      </div>
      <DisplayStep step={section.start} />
    </div>
  );
};

export default DisplaySection;
