import { mapTagToElementName } from '../interfaceElement/elementInfo';
import { ASTNodeType, ASTStepNode } from './AST';
import { ASTInstruction } from './Instruction';

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
      return `Type into the "${step.element.label}" input the text: "${step.text}"`;
    case ASTNodeType.Select:
      return `Use the "${getTruncatedText(step.element.label)}" drop down menu and choose the "${step.option.text}" option`;
    case ASTNodeType.Check:
      return `Ensure the "${step.element.label}" check option is ${step.isChecked ? 'checked' : 'unchecked'}`;
    case ASTNodeType.Radio:
      return `Select the "${step.element.label}" radio option`;
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
  Radio: false,
  Draw: false,
};

export { mapASTInstructionToDescription, isSkippable };
