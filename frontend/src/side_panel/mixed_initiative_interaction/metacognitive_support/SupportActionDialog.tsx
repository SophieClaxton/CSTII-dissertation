import Button from '@mui/material/Button/Button';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { StruggleEvidenceDuration } from '../../../content_script/consts';
import { MetacognitiveSupportAction } from '../../models/support_and_MII/MetacognitiveSupportMII';

interface SupportActionDialogProps {
  open: boolean;
  onClose: () => void;
  action: MetacognitiveSupportAction;
  onAction?: () => void;
}

const mapActionToText: Record<MetacognitiveSupportAction, string> = {
  dec: 'The level of support has been decreased.',
  dec_dialog: 'Would you like to decrease the level of support?',
  none: '',
  inc_dialog: 'Would you like to increase the level of support?',
  inc: 'The level of support has been increased',
};

const SupportActionDialog: React.FC<SupportActionDialogProps> = ({
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
      severity={onAction ? 'info' : 'success'}
      variant="filled"
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

export default SupportActionDialog;
export type { SupportActionDialogProps };
