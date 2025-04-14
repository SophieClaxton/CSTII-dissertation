import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import UserDecisionNode from './UserDecisionNode';
import {
  CSTElementNode,
  CSTInnerStepNode,
  CSTStepNodeType,
} from '../../../../models/CST/CST';
import Step from '../Step';
import ElementSelector from '../instruction_components/ElementSelector';
import { mapIdToString } from '../../../unpublishedScriptReducer/mappers/nodeIds';
import InputDescription from '../InputDescription';
import { EditorActionType } from '../../../../models/EditorAction';
import CheckedSelector from '../instruction_components/CheckedSelector';
import OptionSelector from '../instruction_components/OptionSelector';

interface InnerStepNodeProps {
  step: CSTInnerStepNode;
}

const InnerStepNode: React.FC<InnerStepNodeProps> = ({ step }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: mapIdToString(step.id) });

  const style = { transform: CSS.Transform.toString(transform), transition };

  switch (step.type) {
    case CSTStepNodeType.UserDecision:
      return (
        <UserDecisionNode
          step={step}
          sortableProps={{
            setNodeRef: setNodeRef,
            style: style,
            attributes: attributes,
            listeners: listeners,
          }}
        />
      );
    default:
      return (
        <Step
          stepId={step.id}
          stepType={step.type}
          sortableProps={{
            setNodeRef: setNodeRef,
            style: style,
            attributes: attributes,
            listeners: listeners,
          }}
        >
          <ElementSelector step={step} />
          {mapStepToExtraInputs(step)}
        </Step>
      );
  }
};

const mapStepToExtraInputs = (
  step: CSTElementNode,
): React.ReactNode | undefined => {
  switch (step.type) {
    case CSTStepNodeType.Write:
      return (
        <InputDescription
          getCurrentDescription={() => step.text}
          getIsExact={() => step.isExact ?? false}
          onDescriptionChangeEvent={(
            description: string,
            isExact: boolean,
          ) => ({
            type: EditorActionType.EditInputStepDescription,
            stepId: step.id,
            description: description,
            isExact: isExact,
          })}
          placeholder={'Text'}
        />
      );
    case CSTStepNodeType.Select: {
      if (step.element && step.selector) {
        switch (step.selector.selectType) {
          case 'check':
            return (
              <CheckedSelector
                stepId={step.id}
                isChecked={step.selector.isChecked}
              />
            );
          case 'radio':
            return <></>;
          case 'select':
            return (
              <OptionSelector
                stepId={step.id}
                element={step.element}
                option={step.selector.option}
              />
            );
        }
      }
      return <></>;
    }
    case CSTStepNodeType.Drag:
    case CSTStepNodeType.Draw:
    case CSTStepNodeType.Follow:
    case CSTStepNodeType.Click:
    case CSTStepNodeType.Read:
    case CSTStepNodeType.ScrollTo:
      return undefined;
  }
};

export default InnerStepNode;
