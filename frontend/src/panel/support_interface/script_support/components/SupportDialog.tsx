import Button from '@mui/material/Button/Button';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import { SupportChange } from '../../../models/UserSupport';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
  aboutChange: SupportChange;
  onAction: () => void;
}

const SupportDialog: React.FC<SupportDialogProps> = ({
  open,
  onClose,
  aboutChange,
  onAction,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={7500} onClose={onClose}>
      <Alert
        severity={'info'}
        onClose={onClose}
        action={
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
        }
      >
        {`Would you like to ${aboutChange === 'inc' ? 'increase' : 'decrease'} the level of support?`}
      </Alert>
    </Snackbar>
  );
};

export default SupportDialog;
export type { SupportDialogProps };
