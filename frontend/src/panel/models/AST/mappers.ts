import { CSTStepNodeType } from '../CST/CST';
import { mapTagToElementName } from '../InterfaceElement';
import { ASTNodeType, ASTStepNode } from './AST';

const mapCSTtoASTNodeType: Record<CSTStepNodeType, ASTStepNode['type']> = {
  Follow: ASTNodeType.Follow,
  Click: ASTNodeType.Click,
  Read: ASTNodeType.Read,
  'Scroll To': ASTNodeType.ScrollTo,
  Drag: ASTNodeType.Drag,
  'User Decision': ASTNodeType.UserDecision,
  Write: ASTNodeType.Write,
  Select: ASTNodeType.Select,
  Check: ASTNodeType.Check,
  Draw: ASTNodeType.Draw,
};

const getTruncatedText = (
  text: string | undefined,
  limit: number = 50,
): string => {
  if (!text || text.length <= limit) {
    return text ?? '';
  }
  return `${text.slice(0, limit)}...`;
};

const mapASTStepToDescription = (step: ASTStepNode): string => {
  switch (step.type) {
    case ASTNodeType.End:
      return 'Finished';
    case ASTNodeType.Follow:
      return `Click the link with text "${getTruncatedText(step.element.textContent)}"`;
    case ASTNodeType.Click:
      return `Click the button with text "${getTruncatedText(step.element.textContent)}"`;
    case ASTNodeType.Read:
      return step.element.tag === 'IMG' || step.element.tag === 'VIDEO'
        ? `Look at the ${step.element.tag.toLowerCase()}`
        : `Read the ${mapTagToElementName[step.element.tag].toLowerCase()} starting "${getTruncatedText(step.element.textContent)}"`;
    case ASTNodeType.ScrollTo:
      return `Scroll to the ${mapTagToElementName[step.element.tag].toLowerCase()} with text "${getTruncatedText(step.element.textContent)}"`;
    case ASTNodeType.Drag:
      return `Drag`;
    case ASTNodeType.UserDecision:
      return `Decision needed: ${step.question}`;
    case ASTNodeType.Write:
      return `Type into the input, "${step.text}"`;
    case ASTNodeType.Select:
      return `Use the drop down menu "${getTruncatedText(step.element.textContent)}" and choose the "${step.option}" option`;
    case ASTNodeType.Check:
      return `Ensure the check option is ${step.isChecked ? 'checked' : 'unchecked'}`;
    case ASTNodeType.Draw:
      return `On the canvas, draw ${step.description}`;
  }
};

export { mapCSTtoASTNodeType, mapASTStepToDescription };
