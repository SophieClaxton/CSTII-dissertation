import { SupportChange } from './userSupportMII';
import Button from '@mui/material/Button/Button';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';

interface LevelOfSupportDialogDetails {
  aboutChange: SupportChange;
  onAction: () => void;
}

interface LevelOfSupportDialogProps extends LevelOfSupportDialogDetails {
  open: boolean;
  onClose: () => void;
}

const LevelOfSupportDialog: React.FC<LevelOfSupportDialogProps> = ({
  open,
  onClose,
  aboutChange,
  onAction,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert
        severity={'info'}
        onClose={onClose}
        action={
          <Button color={'inherit'} size={'small'} onClick={onAction}>
            Yes
          </Button>
        }
      >
        {`Would you like to ${aboutChange === 'inc' ? 'increase' : 'decrease'} the level of support?`}
      </Alert>
    </Snackbar>
  );
};

export default LevelOfSupportDialog;
export type { LevelOfSupportDialogDetails };
