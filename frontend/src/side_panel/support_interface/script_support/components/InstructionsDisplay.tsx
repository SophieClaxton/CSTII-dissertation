import Stack from '@mui/material/Stack/Stack';
import Button from '@mui/material/Button/Button';
import { ASTInstruction } from '../../../models/AST/Instruction';
import Instruction from './Instruction';
import { useNavigationContext } from '../../../contexts/contextHooks';
import { StateRef, StateSetter } from '../../../models/utilTypes';
import { ASTNodeType } from '../../../models/AST/AST';
import UserDecisionInstruction from './UserDecisionInstruction';
import { ScriptLocation } from '../../../models/support_and_MII/UserSupport';

interface InstructionsDisplayProps {
  supportActive: boolean;
  visibleInstructions: ASTInstruction[];
  setVisibleInstructions: StateSetter<ASTInstruction[]>;
  currentScriptLocation: StateRef<ScriptLocation>;
  setStepCompleted: StateSetter<ASTInstruction | undefined>;
}

const InstructionsDisplay: React.FC<InstructionsDisplayProps> = ({
  supportActive,
  visibleInstructions,
  setVisibleInstructions,
  currentScriptLocation,
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
            {...{
              supportActive,
              instruction,
              setVisibleInstructions,
              currentScriptLocation,
            }}
          />
        ) : (
          <Instruction {...{ supportActive, instruction, setStepCompleted }} />
        ),
      )}
      {showFinish && (
        <Button variant={'contained'} onClick={goBack}>
          Finish and Close
        </Button>
      )}
    </Stack>
  );
};

export default InstructionsDisplay;
