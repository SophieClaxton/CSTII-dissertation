import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import { mapASTInstructionToDescription } from '../../../models/AST/mappers';
import { ASTInstruction } from '../../../models/AST/Instruction';

interface InstructionProps {
  supportActive: boolean;
  instruction: ASTInstruction;
}

const Instruction: React.FC<InstructionProps> = ({
  supportActive,
  instruction,
}) => {
  const { stage, stepNumber } = instruction;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1.5rem 1fr',
        columnGap: '1rem',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        border: `2px solid ${supportActive && stage === 'next' ? '#1976d2' : 'transparent'}`,
        color:
          supportActive && stage === 'incomplete'
            ? 'text.disabled'
            : 'text.primary',
        backgroundColor:
          supportActive && stage === 'complete'
            ? 'rgb(149, 242, 152)'
            : 'white',
        transition: 'all 1s cubic-bezier(0.44,-0.1, 0.44, 1.1)',
        alignItems: 'center',
      }}
    >
      <Typography
        variant={'h6'}
        component={'p'}
        sx={{
          gridColumnStart: 1,
          textAlign: 'right',
          justifySelf: 'right',
        }}
      >
        {stepNumber.toString()}
      </Typography>
      <Typography
        variant={'body1'}
        sx={{
          gridColumnStart: 2,
          textAlign: 'left',
          justifySelf: 'left',
        }}
      >
        {mapASTInstructionToDescription(instruction)}
      </Typography>
    </Box>
  );
};

export default Instruction;
