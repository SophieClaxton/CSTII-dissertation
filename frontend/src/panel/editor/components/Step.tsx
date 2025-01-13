import React from 'react';
import {
  useTypeErrorsContext,
  useUnpublishedScriptContext,
} from '../../contexts/contextHooks';
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
import Box from '@mui/material/Box/Box';
import { Typography } from '@mui/material';
import { mapIdToString } from '../../unpublishedScriptReducer/mappers/nodeIds';

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

const stepColourMap: Record<CSTStepNodeType, string> = {
  Follow: '#ff999c',
  Click: '#ffde85',
  Read: '#cceb98',
  'Scroll To': '#93cdf1',
  Drag: '#b4a1ce ',
  'User Decision': '#c7eae4',
  Write: '#a7e8bd',
  Select: '#fcbcb8',
  Check: '#efa7a7',
  Draw: '#ffd972',
};

const Step: React.FC<StepProps & React.PropsWithChildren> = ({
  stepId,
  stepType,
  sortableProps,
  className,
  children,
}) => {
  const { dispatch } = useUnpublishedScriptContext();

  const idString = mapIdToString(stepId);

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
      style={{ ...style, backgroundColor: stepColourMap[stepType] }}
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
        onClick={() => dispatch({ type: EditorActionType.DeleteStep, stepId })}
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
