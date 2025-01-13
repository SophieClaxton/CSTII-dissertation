import Stack from '@mui/material/Stack/Stack';
import {
  mapStepNodeToValidTags,
  mapTagToElementName,
} from '../../models/InterfaceElement';
import { useUnpublishedScriptContext } from '../../contexts/contextHooks';
import { EditorActionType } from '../../models/EditorAction';
import Typography from '@mui/material/Typography/Typography';
import { CSTElementNode } from '../../models/CST/CST';
import Dialog from '@mui/material/Dialog/Dialog';
import { useRef, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';
import { getSection } from '../../unpublishedScriptReducer/getters/nodes';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import Link from '@mui/material/Link/Link';
import Edit from '@mui/icons-material/Edit';
import {
  sendClickabilityMessage,
  sendSetFocusMessage,
  sendUnsetFocusMessage,
} from '../../../common/sendMessage';
import Add from '@mui/icons-material/Add';
import { isSection } from '../../models/CST/testers';

interface ElementSelectorProps {
  step: CSTElementNode;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({ step }) => {
  const { dispatch, unpublishedScript } = useUnpublishedScriptContext();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const currentUrl = useRef('');
  const section = getSection(step.id.parentId, unpublishedScript.program);
  const sectionUrl = section && isSection(section) ? section.url : '';

  const text = step.element ? (
    <Stack alignItems={'flex-start'} width={'12rem'}>
      <Typography variant="subtitle1" color="text.primary">
        {mapTagToElementName[step.element.tag]}
      </Typography>
      {step.element.textContent && (
        <Typography
          variant="body2"
          color="text.primary"
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

  return (
    <>
      <Button
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '1rem',
          flexGrow: 1,
          flexShrink: 1,
          backgroundColor: step.element ? 'common.white' : 'grey.300',
          padding: '0.5rem',
          paddingLeft: '5%',
          paddingRight: '5%',
          clipPath:
            'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0% 50%);',
          border: 'none',
          outline: 'none',
          '&:hover': {
            filter: 'brightness(0.95)',
          },
          '&:focus': {
            outline: 'none',
          },
        }}
        onClick={() => {
          const editElement = async () => {
            const [tab] = await chrome.tabs.query({
              active: true,
              lastFocusedWindow: true,
            });
            currentUrl.current = tab.url ?? '';
            if (step.element || (sectionUrl != '' && tab.url != sectionUrl)) {
              setOpenEditDialog(true);
            } else {
              sendClickabilityMessage(
                step.id,
                mapStepNodeToValidTags[step.type],
                tab.url ?? '',
              );
            }
          };
          editElement();
        }}
        onMouseEnter={() => {
          if (step.element) {
            sendSetFocusMessage(step.element);
          }
        }}
        onMouseLeave={() => {
          if (step.element) {
            sendUnsetFocusMessage();
          }
        }}
      >
        {step.element ? <Edit /> : <Add />}
        {text}
      </Button>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Element</DialogTitle>
        {sectionUrl != '' && sectionUrl != currentUrl.current && (
          <DialogContent>
            <DialogContentText>
              You are not on the correct website to select elements for this
              section. You need to be on
              <br />
              <Link href={sectionUrl}>{sectionUrl}</Link>
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          {step.element && (
            <>
              <Button
                disabled={sectionUrl != currentUrl.current}
                onClick={() => {
                  sendClickabilityMessage(
                    step.id,
                    mapStepNodeToValidTags[step.type],
                    currentUrl.current,
                  );
                  setOpenEditDialog(false);
                }}
              >
                Change
              </Button>
              <Button
                onClick={() => {
                  dispatch({
                    type: EditorActionType.EditStepElement,
                    stepId: step.id,
                    element: undefined,
                    oldUrl: '',
                  });
                  setOpenEditDialog(false);
                }}
              >
                Delete
              </Button>
            </>
          )}
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ElementSelector;
