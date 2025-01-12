import Stack from '@mui/material/Stack/Stack';
import {
  mapStepNodeToValidTags,
  mapTagToElementName,
} from '../../models/InterfaceElement';
import IconButton from '@mui/material/IconButton/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { SetClickableMessage } from '../../../common/message';
import { useUnpublishedScriptContext } from '../../contexts/contextHooks';
import { isInnerStepId } from '../../models/CST/testers';
import { EditorActionType } from '../../models/EditorAction';
import Typography from '@mui/material/Typography/Typography';
import { mapIdToString } from '../../unpublishedScriptReducer/mappers/nodeIds';
import { CSTElementNode } from '../../models/CST/CST';

interface ElementSelectorProps {
  step: CSTElementNode;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({ step }) => {
  const { dispatch } = useUnpublishedScriptContext();

  const onAddElement = () => {
    const sendClickabilityMessage = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      const message: SetClickableMessage = {
        type: 'set_clickable',
        stepId: mapIdToString(step.id),
        validTags: mapStepNodeToValidTags[step.type],
      };
      chrome.tabs
        .sendMessage(tab.id!, message)
        .catch((error) => console.log(error));
    };
    sendClickabilityMessage();
  };

  const onDeleteElement = () => {
    if (isInnerStepId(step.id)) {
      dispatch({
        type: EditorActionType.EditInnerStepElement,
        stepId: step.id,
        element: undefined,
        oldUrl: '',
      });
    } else {
      dispatch({
        type: EditorActionType.EditEndStepElement,
        stepId: step.id,
        element: undefined,
        oldUrl: '',
      });
    }
  };

  const text = step.element ? (
    <Stack alignItems={'flex-start'} width={'12rem'}>
      <Typography variant="subtitle1">
        {mapTagToElementName[step.element.tag]}
      </Typography>
      {step.element.textContent && (
        <Typography
          variant="body2"
          sx={{
            textOverflow: 'ellipsis',
            textWrap: 'noWrap',
            overflow: 'hidden',
            width: 'inherit',
            textAlign: 'left',
          }}
        >
          {`"${step.element.textContent}"`}
        </Typography>
      )}
    </Stack>
  ) : (
    <Typography>Add Element</Typography>
  );
  const action = step.element ? onDeleteElement : onAddElement;
  const icon = step.element ? <Delete /> : <Add />;

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      spacing={1}
      sx={{
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        backgroundColor: 'primary.light',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        paddingLeft: '5%',
        paddingRight: '5%',
        clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0% 50%);',
      }}
    >
      {text}
      <IconButton
        sx={{
          borderRadius: '0.25rem',
          padding: '0rem',
        }}
        onClick={action}
      >
        {icon}
      </IconButton>
    </Stack>
  );
};

export default ElementSelector;
