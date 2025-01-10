import Alert from '@mui/material/Alert/Alert';
import Snackbar from '@mui/material/Snackbar/Snackbar';

interface SnackBarDetails {
  open: boolean;
  message: string;
  error: boolean;
}

interface AlertSnackBarProps {
  snackBar: SnackBarDetails;
  setSnackBar: (value: SnackBarDetails) => void;
}

const AlertSnackBar: React.FC<AlertSnackBarProps> = ({
  snackBar,
  setSnackBar,
}) => {
  return (
    <Snackbar
      open={snackBar.open}
      autoHideDuration={3000}
      onClose={() => setSnackBar({ open: false, message: '', error: false })}
    >
      <Alert
        severity={snackBar.error ? 'error' : 'success'}
        onClose={() => setSnackBar({ open: false, message: '', error: false })}
      >
        {snackBar.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackBar;
export type { SnackBarDetails };
