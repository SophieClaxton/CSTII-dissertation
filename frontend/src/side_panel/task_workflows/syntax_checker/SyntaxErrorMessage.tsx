import React from 'react';
import Alert from '@mui/material/Alert/Alert';

interface SyntaxErrorMessageDetails {
  id: string;
  errorMsg: string;
}

const SyntaxErrorMessage: React.FC<SyntaxErrorMessageDetails> = ({
  id,
  errorMsg,
}) => {
  return (
    <Alert
      id={`synErr-${id}}`}
      icon={false}
      variant="outlined"
      severity="error"
    >
      {errorMsg}
    </Alert>
  );
};

export default SyntaxErrorMessage;
export type { SyntaxErrorMessageDetails };
