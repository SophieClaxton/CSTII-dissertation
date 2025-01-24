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
}

const InstructionsDisplay: React.FC<InstructionsDisplayProps> = ({
  supportActive,
  visibleInstructions,
  setVisibleInstructions,
}) => {
  const { goBack } = useNavigationContext();
  const lastStep = visibleInstructions.at(-1);
  const showFinish = lastStep && lastStep.stage === 'complete';

  return (
    <Stack direction={'column'} spacing={2} padding={'1rem'}>
      {visibleInstructions.map((instruction) =>
        instruction.type === ASTNodeType.UserDecision ? (
          <UserDecisionInstruction
            {...{ supportActive, instruction, setVisibleInstructions }}
          />
        ) : (
          <Instruction {...{ supportActive, instruction }} />
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
