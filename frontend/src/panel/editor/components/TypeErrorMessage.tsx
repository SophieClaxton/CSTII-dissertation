import React from 'react';
import './styles/typeErrorMessage.css';
import Box from '@mui/material/Box/Box';

interface TypeErrorMessageProps {
  id: string;
  errorMsg: string;
}

const TypeErrorMessage: React.FC<TypeErrorMessageProps> = ({
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

export default TypeErrorMessage;
