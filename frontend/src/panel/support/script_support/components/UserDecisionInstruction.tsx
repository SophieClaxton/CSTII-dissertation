import Box from '@mui/material/Box/Box';
import {
  ASTInstruction,
  InstructionDetail,
} from '../../../models/AST/Instruction';
import Typography from '@mui/material/Typography/Typography';
import { ASTStepNode, ASTUserDecisionNode } from '../../../models/AST/AST';
import Button from '@mui/material/Button/Button';
import { StateSetter } from '../../../models/utilTypes';
import { getVisibleInstructions } from '../../../models/AST/getters';

interface UserDecisionInstructionProps {
  supportActive: boolean;
  instruction: ASTUserDecisionNode & InstructionDetail;
  setVisibleInstructions: StateSetter<ASTInstruction[]>;
}

const UserDecisionInstruction: React.FC<UserDecisionInstructionProps> = ({
  supportActive,
  instruction,
  setVisibleInstructions,
}) => {
  const { stage, stepNumber } = instruction;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1.5rem 1fr 1fr',
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
          gridColumnEnd: 4,
          textAlign: 'left',
          justifySelf: 'left',
        }}
      >
        {instruction.question}
      </Typography>
      <Button
        variant={'outlined'}
        sx={{
          gridColumnStart: 2,
        }}
        onClick={() =>
          onUpdateVisibleInstruction(
            setVisibleInstructions,
            instruction,
            instruction.choice1.start,
          )
        }
        disabled={stage != 'next'}
      >
        Yes
      </Button>
      <Button
        variant={'outlined'}
        sx={{
          gridColumnStart: 3,
        }}
        onClick={() =>
          onUpdateVisibleInstruction(
            setVisibleInstructions,
            instruction,
            instruction.choice2.start,
          )
        }
        disabled={stage != 'next'}
      >
        No
      </Button>
    </Box>
  );
};

const onUpdateVisibleInstruction = (
  setVisibleInstructions: StateSetter<ASTInstruction[]>,
  instruction: ASTUserDecisionNode & InstructionDetail,
  startStep: ASTStepNode,
) => {
  const updateInstructionStage = (instr: ASTInstruction): ASTInstruction =>
    instr.stepNumber === instruction.stepNumber
      ? { ...instr, stage: 'complete' }
      : instr;

  setVisibleInstructions((prev) => [
    ...prev.map(updateInstructionStage),
    ...getVisibleInstructions(startStep, instruction.stepNumber),
  ]);
};

export default UserDecisionInstruction;
