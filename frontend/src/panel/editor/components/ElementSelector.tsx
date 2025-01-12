import Stack from '@mui/material/Stack/Stack';
import InterfaceElement, {
  defaultSelectableTags,
  mapTagToElementName,
  SelectableTag,
} from '../../models/InterfaceElement';
import IconButton from '@mui/material/IconButton/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { SetClickableMessage } from '../../../common/message';
import { CSTEndStepId, CSTInnerStepId } from '../../models/CST/CST';
import { useUnpublishedScriptContext } from '../../contexts/contextHooks';
import { isInnerStepId } from '../../models/CST/testers';
import { EditorActionType } from '../../models/EditorAction';
import Typography from '@mui/material/Typography/Typography';
import { mapIdToString } from '../../unpublishedScriptReducer/mappers/nodeIds';

interface ElementSelectorProps {
  stepId: CSTInnerStepId | CSTEndStepId;
  element: InterfaceElement | undefined;
  selectableTags?: SelectableTag[];
  isFollowStep?: boolean;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({
  stepId,
  element,
  selectableTags,
}) => {
  const { dispatch } = useUnpublishedScriptContext();

  const onAddElement = () => {
    const sendClickabilityMessage = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      const message: SetClickableMessage = {
        type: 'set_clickable',
        stepId: mapIdToString(stepId),
        validTags: selectableTags ?? [...defaultSelectableTags],
      };
      chrome.tabs
        .sendMessage(tab.id!, message)
        .catch((error) => console.log(error));
    };
    sendClickabilityMessage();
  };

  const onDeleteElement = () => {
    if (isInnerStepId(stepId)) {
      dispatch({
        type: EditorActionType.EditInnerStepElement,
        stepId: stepId,
        element: undefined,
        oldUrl: '',
      });
    } else {
      dispatch({
        type: EditorActionType.EditEndStepElement,
        stepId: stepId,
        element: undefined,
        oldUrl: '',
      });
    }
  };

  const text = element ? (
    <Stack alignItems={'flex-start'} width={'12rem'}>
      <Typography variant="subtitle1">
        {mapTagToElementName[element.tag]}
      </Typography>
      {element.textContent && (
        <Typography
          variant="body2"
          sx={{
            textOverflow: 'ellipsis',
            textWrap: 'noWrap',
            overflow: 'hidden',
            width: 'inherit',
          }}
        >
          {`"${element.textContent}"`}
        </Typography>
      )}
    </Stack>
  ) : (
    <Typography>Add Element</Typography>
  );
  const action = element ? onDeleteElement : onAddElement;
  const icon = element ? <Delete /> : <Add />;

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
