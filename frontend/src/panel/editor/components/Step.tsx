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
import { mapIdToString } from '../../unpublishedScriptReducer/mappers/nodeIds';
import Typography from '@mui/material/Typography/Typography';
import Stack from '@mui/material/Stack/Stack';
import Box from '@mui/material/Box/Box';

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

const BaseStep: React.FC<StepProps & React.PropsWithChildren> = ({
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
        stepError ? 'step-with-error' : '',
        sortableProps ? 'draggable-step' : '',
        className ?? [],
      ].join(' ')}
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: stepColourMap[stepType],
        position: 'relative',
        width: 'fit-content',
        borderRadius: '0.5rem',
        display: 'flex',
        gridTemplateAreas: `'dragHandle stepName stepInputs deleteStep'`,
        gridTemplateColumns: '1.625rem 5rem 20rem 1.625rem',
        gap: '0.5rem',
        transition: 'margin ease-in-out 0.5s',
      }}
    >
      {sortableProps ? (
        <div className={'drag-handle'} {...attributes} {...listeners}>
          <DragIndicator />
        </div>
      ) : (
        <div className="drag-handle-placeholder"></div>
      )}
      {children}
      <IconButton
        onClick={() => dispatch({ type: EditorActionType.DeleteStep, stepId })}
        sx={{
          paddingRight: '0.125rem',
          height: '100%',
          padding: 0,
          borderRadius: 0,
          borderTopRightRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
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

/** The child elements passed to the Step component should be
 * components that provide input mechanisms for the Step's
 * properties.
 *
 * Example input mechanisms include:
 * * An HTML element selector
 * * A comment input
 * * An input-description input
 *
 */
const Step: React.FC<StepProps & React.PropsWithChildren> = ({
  children,
  ...props
}) => {
  const { stepType } = props;

  return (
    <BaseStep {...props}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: `'stepName stepInputs'`,
          gridTemplateColumns: '5rem 16rem',
          gap: '0.5rem',
        }}
      >
        <Typography
          variant={'h6'}
          sx={{
            gridArea: 'stepName',
            textWrap: 'wrap',
            textAlign: 'left',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          {stepType}
        </Typography>
        <Stack
          sx={{
            gridArea: 'stepInputs',
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
            gap: '0.5rem',
            justifyContent: 'center',
          }}
        >
          {children}
        </Stack>
      </Box>
    </BaseStep>
  );
};

export default Step;
export { BaseStep };
