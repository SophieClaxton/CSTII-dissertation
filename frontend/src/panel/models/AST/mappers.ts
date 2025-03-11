import { CSTStepNodeType } from '../CST/CST';
import { mapTagToElementName } from '../InterfaceElement';
import { ASTNodeType, ASTStepNode } from './AST';
import { ASTInstruction } from './Instruction';

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

const mapASTInstructionToDescription = (step: ASTInstruction): string => {
  switch (step.type) {
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
      return `Type into the input "${step.element.label}", "${step.text}"`;
    case ASTNodeType.Select:
      return `Use the drop down menu "${getTruncatedText(step.element.label, 15)}" and choose the "${step.option.text}" option`;
    case ASTNodeType.Check:
      return `Ensure the check option "${step.element.label}" is ${step.isChecked ? 'checked' : 'unchecked'}`;
    case ASTNodeType.Draw:
      return `On the canvas, draw ${step.description}`;
  }
};

const isSkippable: Record<ASTStepNode['type'], boolean> = {
  End: false,
  Follow: false,
  Click: false,
  Read: true,
  'Scroll To': true,
  Drag: false,
  'User Decision': false,
  Write: false,
  Select: false,
  Check: false,
  Draw: false,
};

export { mapCSTtoASTNodeType, mapASTInstructionToDescription, isSkippable };
