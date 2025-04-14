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
        inputElement.click();
        if (step.isExact) {
          const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
          });
          const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true,
          });
          inputElement.value = step.text;
          inputElement.dispatchEvent(inputEvent);
          inputElement.dispatchEvent(changeEvent);
        }
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
        selectElement.click();
        for (const option of selectElement.options) {
          if (option.value === step.option.value) {
            option.selected = true;
          }
        }
        const inputEvent = new Event('input', {
          bubbles: true,
          cancelable: true,
        });
        const changeEvent = new Event('change', {
          bubbles: true,
          cancelable: true,
        });
        selectElement.dispatchEvent(inputEvent);
        selectElement.dispatchEvent(changeEvent);
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
        if (inputElement.checked != step.isChecked) {
          const mouseDownEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          inputElement.dispatchEvent(mouseDownEvent);
        } else {
          const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
          });
          inputElement.dispatchEvent(inputEvent);
        }
      }
    }, 1000);
  };

const doRadioStep: SystemStepAction =
  (step: ASTInstruction) => (element: Element, supportState: SupportState) => {
    if (step.type != ASTNodeType.Radio) {
      return;
    }
    supportState.timeoutId = setTimeout(() => {
      if (isHTMLElement(element) && element.tagName === 'INPUT') {
        const inputElement = element as HTMLInputElement;
        const mouseDownEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        inputElement.dispatchEvent(mouseDownEvent);
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
    [ASTNodeType.Radio]: doRadioStep,
    [ASTNodeType.ScrollTo]: onScrollStepComplete,
    [ASTNodeType.UserDecision]: () => () => {},
    [ASTNodeType.Read]: () => () => {},
    [ASTNodeType.Drag]: () => () => {},
    [ASTNodeType.Draw]: () => () => {},
  };

export { onScrollStepComplete, mapStepToSystemAction };
