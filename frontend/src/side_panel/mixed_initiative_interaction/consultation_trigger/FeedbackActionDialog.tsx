import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Button from '@mui/material/Button/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { StruggleEvidenceDuration } from '../../../content_script/consts';
import { ConsultationTriggerAction } from '../../models/support_and_MII/ConsultationTriggerMII';

interface FeedbackActionDialogProps {
  open: boolean;
  onClose: () => void;
  action: ConsultationTriggerAction;
  onAction?: () => void;
}

const mapActionToText: Record<ConsultationTriggerAction, string> = {
  none: '',
  dialog:
    'It seems likely that there is a problem with the support, would you like the system to report it?',
  send: 'The system has identified a problem with the support and reported it.',
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
