import { ASTStepNode, ASTNodeType, ASTPlaceholderNode } from '../../../models/AST';
import DisplaySubsection from './DisplaySubsection';

interface DisplayStepProps {
  step: ASTStepNode | ASTPlaceholderNode;
}

const DisplayStep: React.FC<DisplayStepProps> = ({ step }) => {
  switch (step.type) {
    case ASTNodeType.End:
    case ASTNodeType.Placeholder:
      return <></>;
    case ASTNodeType.UserDecision:
      return (
        <>
          <div className="step">
            <p>{step.type.toUpperCase()}</p>
            <p>{step.question}</p>
          </div>
          <div className="decision-outcomes">
            <DisplaySubsection subsection={step.choice1} />
            <DisplaySubsection subsection={step.choice2} />
          </div>
        </>
      );
    case ASTNodeType.Follow:
      return (
        <div className="step">
          <p>{step.type.toUpperCase()}</p>
          <p>{step.element.tag}</p>
        </div>
      );
    default:
      return (
        <>
          <div className="step">
            <p>{step.type.toUpperCase()}</p>
            <p>{step.element.tag}</p>
          </div>
          <DisplayStep step={step.next} />
        </>
      );
  }
};

export default DisplayStep;
