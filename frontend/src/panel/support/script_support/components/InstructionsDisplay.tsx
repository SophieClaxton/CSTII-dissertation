import Stack from '@mui/material/Stack/Stack';
import Button from '@mui/material/Button/Button';
import { ASTInstruction } from '../../../models/AST/Instruction';
import Instruction from './Instruction';
import { useNavigationContext } from '../../../contexts/contextHooks';
import { StateSetter } from '../../../models/utilTypes';
import { ASTNodeType } from '../../../models/AST/AST';
import UserDecisionInstruction from './UserDecisionInstruction';

interface InstructionsDisplayProps {
  supportActive: boolean;
  visibleInstructions: ASTInstruction[];
  setVisibleInstructions: StateSetter<ASTInstruction[]>;
  setStepCompleted: StateSetter<ASTInstruction | undefined>;
}

const InstructionsDisplay: React.FC<InstructionsDisplayProps> = ({
  supportActive,
  visibleInstructions,
  setVisibleInstructions,
  setStepCompleted,
}) => {
  const { goBack } = useNavigationContext();
  const lastStep = visibleInstructions.at(-1);
  const showFinish = lastStep && lastStep.stage === 'complete';

  return (
    <Stack
      sx={{
        flexDirection: 'column',
        gap: '1rem',
        paddingTop: '1rem',
        paddingBottom: '4rem',
        overflowY: 'scroll',
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
    >
      {visibleInstructions.map((instruction) =>
        instruction.type === ASTNodeType.UserDecision ? (
          <UserDecisionInstruction
            {...{ supportActive, instruction, setVisibleInstructions }}
          />
        ) : (
          <Instruction {...{ supportActive, instruction, setStepCompleted }} />
        ),
      )}
      {showFinish && (
        <Button variant={'contained'} onClick={goBack}>
          Finish
        </Button>
      )}
    </Stack>
  );
};

export default InstructionsDisplay;
