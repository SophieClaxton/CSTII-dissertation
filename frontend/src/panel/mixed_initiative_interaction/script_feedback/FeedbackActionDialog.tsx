import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Button from '@mui/material/Button/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { StruggleEvidenceDuration } from '../../../content_scripts/consts';
import { ScriptFeedbackAction } from '../../models/support_and_MII/ScriptFeedbackMII';

interface FeedbackActionDialogProps {
  open: boolean;
  onClose: () => void;
  action: ScriptFeedbackAction;
  onAction?: () => void;
}

const mapActionToText: Record<ScriptFeedbackAction, string> = {
  none: '',
  dialog:
    'Would you like to tell the script writer that there might be a problem with their script?',
  send: 'The script writer has been notified that there might be a problem with the script.',
};

const FeedbackActionDialog: React.FC<FeedbackActionDialogProps> = ({
  open,
  onClose,
  action,
  onAction,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={
      onAction ? 0.5 * StruggleEvidenceDuration : 0.3 * StruggleEvidenceDuration
    }
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert
      severity={action === 'dialog' ? 'info' : 'success'}
      iconMapping={{
        success: <CheckCircleOutlineIcon fontSize="inherit" />,
        info: <HelpOutline />,
      }}
      onClose={onClose}
      action={
        onAction && (
          <Button
            color={'inherit'}
            size={'small'}
            onClick={() => {
              onAction();
              onClose();
            }}
          >
            Yes
          </Button>
        )
      }
    >
      {mapActionToText[action]}
    </Alert>
  </Snackbar>
);

export default FeedbackActionDialog;
export type { FeedbackActionDialogProps };
