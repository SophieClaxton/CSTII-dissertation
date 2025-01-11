import Stack from '@mui/material/Stack/Stack';
import InterfaceElement, {
  defaultSelectableTags,
  isSelectableTag,
  mapTagToElementName,
  SelectableTag,
} from '../../models/InterfaceElement';
import IconButton from '@mui/material/IconButton/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { Message, SetClickableMessage } from '../../../common/message';
import { CSTEndStepId, CSTInnerStepId } from '../../models/CST/CST';
import { useUnpublishedScriptContext } from '../../contexts/contextHooks';
import { isInnerStepId } from '../../models/CST/testers';
import { EditorActionType } from '../../models/EditorAction';
import { mapNodeIdToString } from '../../models/CST/mappers';
import Typography from '@mui/material/Typography/Typography';

interface ElementSelectorProps {
  stepId: CSTInnerStepId | CSTEndStepId;
  element: InterfaceElement | undefined;
  selectableTags?: SelectableTag[];
}

const ElementSelector: React.FC<ElementSelectorProps> = ({
  stepId,
  element,
  selectableTags,
}) => {
  const { dispatch } = useUnpublishedScriptContext();

  const addMessageListener = () => {
    chrome.runtime.onMessage.addListener(async (message: Message) => {
      if (
        message.type === 'clicked_element' &&
        message.stepId === mapNodeIdToString(stepId)
      ) {
        if (!isSelectableTag(message.elementTag)) {
          throw Error('Received an invalid element tag');
        }

        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        if (isInnerStepId(stepId)) {
          dispatch({
            type: EditorActionType.EditInnerStep,
            stepId: stepId,
            element: {
              outerHTML: message.elementOuterHtml,
              tag: message.elementTag,
              textContent: message.elementTextContent ?? undefined,
              url: tab.url || '',
            },
          });
        } else {
          dispatch({
            type: EditorActionType.EditEndStep,
            stepId: stepId,
            element: {
              outerHTML: message.elementOuterHtml,
              tag: message.elementTag,
              textContent: message.elementTextContent ?? undefined,
              url: tab.url || '',
            },
          });
        }
      }
    });
  };

  useEffect(addMessageListener, [dispatch, stepId]);

  const onAddElement = () => {
    const sendClickabilityMessage = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      const message: SetClickableMessage = {
        type: 'set_clickable',
        stepId: mapNodeIdToString(stepId),
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
        type: EditorActionType.EditInnerStep,
        stepId: stepId,
        element: undefined,
      });
    } else {
      dispatch({
        type: EditorActionType.EditEndStep,
        stepId: stepId,
        element: undefined,
      });
    }
  };

  const text = element ? (
    <Stack alignItems={'flex-start'} sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle1">
        {mapTagToElementName[element.tag]}
      </Typography>
      {element.textContent && (
        <Typography
          variant="body2"
          sx={{ textOverflow: 'ellipsis', textWrap: 'noWrap' }}
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
      spacing={1}
      sx={{
        width: '100%',
        overflow: 'hidden',
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
        sx={{ borderRadius: '0.25rem', padding: '0rem' }}
        onClick={action}
      >
        {icon}
      </IconButton>
    </Stack>
  );
};

export default ElementSelector;
