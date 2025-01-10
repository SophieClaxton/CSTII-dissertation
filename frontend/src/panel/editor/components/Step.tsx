import React from 'react';
import { useTypeErrorsContext } from '../../contexts/contextHooks';
import { mapNodeIdToString } from '../../models/CST/mappers';
import { CSTNodeId } from '../../models/CST/CST';
import { DraggableAttributes } from '@dnd-kit/core/dist/hooks/useDraggable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners';
import './CST/styles/step.css';

interface StepProps {
  stepId: CSTNodeId;
  sortableProps?: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: { transform: string | undefined; transition: string | undefined };
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
  className?: string;
}

const Step: React.FC<StepProps & React.PropsWithChildren> = ({
  stepId,
  sortableProps,
  className,
  children,
}) => {
  const idString = mapNodeIdToString(stepId);

  const typeErrors = useTypeErrorsContext();
  const stepError = typeErrors.get(idString);

  const { setNodeRef, style, attributes, listeners } = sortableProps ?? {
    setNodeRef: undefined,
    style: undefined,
    attributes: undefined,
    listeners: undefined,
  };

  return (
    <div
      id={idString}
      key={idString}
      className={[
        'step',
        stepError ? 'step-with-error' : '',
        sortableProps ? 'draggable-step' : '',
        className ?? [],
      ].join(' ')}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
      {stepError && (
        <div id={`${stepId}-Error`} className="step-error">
          {stepError}
        </div>
      )}
    </div>
  );
};

export default Step;
