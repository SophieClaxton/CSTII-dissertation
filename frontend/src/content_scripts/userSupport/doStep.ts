import { isHTMLElement } from '@dnd-kit/utilities';
import { ASTNodeType } from '../../panel/models/AST/AST';
import { ASTInstruction } from '../../panel/models/AST/Instruction';
import { sendDetectionMessage } from './detectStep';
import { SupportState } from './state';

type SystemStepAction = (
  step: ASTInstruction,
) => (element: Element, supportState: SupportState) => void;

const onScrollStepComplete: SystemStepAction =
  (step: ASTInstruction) => (_element: Element, supportState: SupportState) => {
    supportState.timeoutId = setTimeout(() => {
      sendDetectionMessage(supportState, step);
    }, 2000);
  };

const doClickStep: SystemStepAction =
  () => (element: Element, supportState: SupportState) => {
    supportState.timeoutId = setTimeout(() => {
      if (isHTMLElement(element)) {
        element.click();
      }
    }, 1000);
  };

const doWriteStep: SystemStepAction =
  (step: ASTInstruction) => (element: Element, supportState: SupportState) => {
    if (step.type != ASTNodeType.Write) {
      return;
    }
    supportState.timeoutId = setTimeout(() => {
      if (isHTMLElement(element) && element.tagName === 'INPUT') {
        const inputElement = element as HTMLInputElement;
        inputElement.value = step.text;
        sendDetectionMessage(supportState, step);
      }
    }, 1000);
  };

const doSelectStep: SystemStepAction =
  (step: ASTInstruction) => (element: Element, supportState: SupportState) => {
    if (step.type != ASTNodeType.Select) {
      return;
    }
    supportState.timeoutId = setTimeout(() => {
      if (isHTMLElement(element) && element.tagName === 'SELECT') {
        const selectElement = element as HTMLSelectElement;
        let updated = false;
        selectElement.click();
        for (const option of selectElement.options) {
          if (option.value === step.option.value) {
            option.selected = true;
            updated = true;
          }
        }
        if (updated) {
          sendDetectionMessage(supportState, step);
        }
      }
    }, 1000);
  };

const doCheckStep: SystemStepAction =
  (step: ASTInstruction) => (element: Element, supportState: SupportState) => {
    if (step.type != ASTNodeType.Check) {
      return;
    }
    supportState.timeoutId = setTimeout(() => {
      if (isHTMLElement(element) && element.tagName === 'INPUT') {
        const inputElement = element as HTMLInputElement;
        inputElement.checked = step.isChecked;
        sendDetectionMessage(supportState, step);
      }
    }, 1000);
  };

const mapStepToSystemAction: Record<ASTInstruction['type'], SystemStepAction> =
  {
    [ASTNodeType.Click]: doClickStep,
    [ASTNodeType.Follow]: doClickStep,
    [ASTNodeType.Write]: doWriteStep,
    [ASTNodeType.Select]: doSelectStep,
    [ASTNodeType.Check]: doCheckStep,
    [ASTNodeType.ScrollTo]: onScrollStepComplete,
    [ASTNodeType.UserDecision]: () => () => {},
    [ASTNodeType.Read]: () => () => {},
    [ASTNodeType.Drag]: () => () => {},
    [ASTNodeType.Draw]: () => () => {},
  };

export { onScrollStepComplete, mapStepToSystemAction };
