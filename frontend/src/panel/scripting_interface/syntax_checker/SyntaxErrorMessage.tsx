import React from 'react';
import './syntaxErrorMessage.css';
import Box from '@mui/material/Box/Box';

interface SyntaxErrorMessageProps {
  id: string;
  errorMsg: string;
}

const SyntaxErrorMessage: React.FC<SyntaxErrorMessageProps> = ({
  id,
  errorMsg,
}) => {
  return (
    <Box
      id={id}
      className="type-error"
      sx={{
        padding: '0.25rem',
        border: '2px solid #d32f2f',
        color: 'rgb(95, 33, 32)',
        backgroundColor: 'rgb(253, 237, 237)',
      }}
    >
      {errorMsg}
    </Box>
  );
};

export default SyntaxErrorMessage;
