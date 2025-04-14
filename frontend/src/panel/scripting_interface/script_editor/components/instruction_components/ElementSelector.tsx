import Stack from '@mui/material/Stack/Stack';
import {
  useTabContext,
  useUnpublishedScriptContext,
} from '../../../../contexts/contextHooks';
import { EditorActionType } from '../../../../models/EditorAction';
import Typography from '@mui/material/Typography/Typography';
import { CSTElementNode } from '../../../../models/CST/CST';
import Dialog from '@mui/material/Dialog/Dialog';
import { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';
import { getSection } from '../../../unpublishedScriptReducer/getters/nodes';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import Link from '@mui/material/Link/Link';
import Edit from '@mui/icons-material/Edit';
import {
  sendClickabilityMessage,
  sendSetFocusMessage,
  sendUnsetFocusMessage,
} from '../../../../../messaging/sendMessage';
import Add from '@mui/icons-material/Add';
import { isSection } from '../../../../models/CST/testers';
import { mapTagToElementName } from '../../../../models/interface_element/elementInfo';
import { urlsMatch } from '../../script_utils/elementUtils';

interface ElementSelectorProps {
  step: CSTElementNode;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({ step }) => {
  const { dispatch, unpublishedScript } = useUnpublishedScriptContext();
  const { tab } = useTabContext();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const section = getSection(step.id.parentId, unpublishedScript.program);
  const sectionUrl = section && isSection(section) ? section.url : '';

  const elementDescription = step.element?.label ?? step.element?.textContent;

  const text = step.element ? (
    <Stack
      sx={{ alignItems: 'flex-start', width: 'calc(16rem - 9% - 1.625rem)' }}
    >
      <Typography
        variant="subtitle1"
        color="text.primary"
        sx={{ textAlign: 'left', lineHeight: '1.25' }}
      >
        {mapTagToElementName[step.element.tag]}
      </Typography>
      {elementDescription && (
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
          {`"${elementDescription}"`}
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
          gap: '0.25rem',
          backgroundColor: step.element ? 'common.white' : 'grey.300',
          padding: '0.25rem 5% 0.25rem 4%',
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
            if (
              step.element ||
              (sectionUrl != '' && !urlsMatch(sectionUrl, tab.url))
            ) {
              setOpenEditDialog(true);
            } else {
              sendClickabilityMessage(tab.id, step.id, step.type, tab.url);
            }
          };
          editElement();
        }}
        onMouseEnter={() => {
          if (step.element && urlsMatch(tab.url, step.element.url)) {
            sendSetFocusMessage(tab.id, step.element);
          }
        }}
        onMouseLeave={() => {
          if (step.element && urlsMatch(tab.url, step.element.url)) {
            sendUnsetFocusMessage(tab.id);
          }
        }}
      >
        {step.element ? <Edit /> : <Add />}
        {text}
      </Button>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Element</DialogTitle>
        {sectionUrl != '' && !urlsMatch(sectionUrl, tab.url) && (
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
                disabled={!urlsMatch(sectionUrl, tab.url)}
                onClick={() => {
                  sendClickabilityMessage(tab.id, step.id, step.type, tab.url);
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
