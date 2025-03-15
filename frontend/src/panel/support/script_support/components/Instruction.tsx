import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import { mapASTInstructionToDescription } from '../../../models/AST/mappers';
import { ASTInstruction } from '../../../models/AST/Instruction';
import Button from '@mui/material/Button/Button';
import { StateSetter } from '../../../models/utilTypes';
import { ASTNodeType } from '../../../models/AST/AST';

interface InstructionProps {
  supportActive: boolean;
  instruction: ASTInstruction;
  setStepCompleted: StateSetter<ASTInstruction | undefined>;
}

const Instruction: React.FC<InstructionProps> = ({
  supportActive,
  instruction,
  setStepCompleted,
}) => {
  const { stage, stepNumber } = instruction;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1.5rem 1fr',
        width: 'calc(100% - 2rem)',
        maxWidth: '28rem',
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
      {(instruction.type === ASTNodeType.Read ||
        (instruction.type === ASTNodeType.Write &&
          instruction.isExact === false)) && (
        <Button
          sx={{
            padding: '0.25rem',
            lineHeight: 1,
            minWidth: 'fit-content',
            gridColumnStart: 2,
            justifySelf: 'end',
          }}
          onClick={() => setStepCompleted(instruction)}
          disabled={!supportActive}
        >
          Done
        </Button>
      )}
    </Box>
  );
};

export default Instruction;
