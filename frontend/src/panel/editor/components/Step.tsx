import React from 'react';
import {
  useTypeErrorsContext,
  useUnpublishedScriptContext,
} from '../../contexts/contextHooks';
import { mapNodeIdToString } from '../../models/CST/mappers';
import {
  CSTEndStepId,
  CSTInnerStepId,
  CSTStepNodeType,
} from '../../models/CST/CST';
import { DraggableAttributes } from '@dnd-kit/core/dist/hooks/useDraggable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners';
import './styles/step.css';
import DragIndicator from '@mui/icons-material/DragIndicator';
import IconButton from '@mui/material/IconButton/IconButton';
import Delete from '@mui/icons-material/Delete';
import { EditorActionType } from '../../models/EditorAction';
import { isInnerStepId } from '../../models/CST/testers';
import Box from '@mui/material/Box/Box';
import { Typography } from '@mui/material';

interface StepProps {
  stepId: CSTInnerStepId | CSTEndStepId;
  stepType: CSTStepNodeType;
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
  stepType,
  sortableProps,
  className,
  children,
}) => {
  const { dispatch } = useUnpublishedScriptContext();

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
      // {...attributes}
      // {...listeners}
    >
      {sortableProps ? (
        <div className={'drag-handle'} {...attributes} {...listeners}>
          <DragIndicator />
        </div>
      ) : (
        <div className="drag-handle-placeholder"></div>
      )}
      <Box
        sx={{
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
      >
        <Typography
          variant={'h6'}
          sx={{
            width: '8rem',
            textWrap: 'wrap',
            textAlign: 'left',
            flexGrow: 0,
          }}
        >
          {stepType}
        </Typography>
        {children}
      </Box>
      <IconButton
        onClick={() => {
          if (isInnerStepId(stepId)) {
            return dispatch({
              type: EditorActionType.DeleteInnerStep,
              innerStepId: stepId,
            });
          }
          return dispatch({
            type: EditorActionType.DeleteEndStep,
            endStepId: stepId,
          });
        }}
        sx={{ height: '100%', padding: 0, borderRadius: 0 }}
      >
        <Delete />
      </IconButton>
      {stepError && (
        <div id={`${stepId}-Error`} className="step-error">
          {stepError}
        </div>
      )}
    </div>
  );
};

export default Step;
