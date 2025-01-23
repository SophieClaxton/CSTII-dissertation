import { ASTProgram } from '../../models/AST/AST';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box/Box';
import { mapASTStepToDescription } from '../../models/AST/mappers';
import { useNavigationContext } from '../../contexts/contextHooks';
import Button from '@mui/material/Button/Button';
import { LevelOfSupport } from './userSupportMII';
import { StateSetter } from '../../models/utilTypes';
import { LevelOfSupportDialogDetails } from './LevelOfSupportDialog';
import { useAddStepCompletedListener } from './listenerHook';

interface ProgramSupportProps {
  program: ASTProgram;
  setProvidingSupport: StateSetter<boolean | undefined>;
  setLevelOfSupport: StateSetter<LevelOfSupport>;
  setDialogDetails: StateSetter<LevelOfSupportDialogDetails>;
}

const ProgramSupport: React.FC<ProgramSupportProps> = ({
  program,
  setLevelOfSupport,
  setDialogDetails,
}) => {
  const { goBack } = useNavigationContext();
  const { visibleSteps, currentStepNumber, baseStepNumber, showFinish } =
    useAddStepCompletedListener(program, setLevelOfSupport, setDialogDetails);
  console.log('Loading Program Support');

  return (
    <>
      <Stack direction={'column'} spacing={2} padding={'1rem'}>
        {visibleSteps.map((step, index) => {
          const stepNumber = index + baseStepNumber;
          return (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1.5rem 1fr',
                columnGap: '1rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: `2px solid ${currentStepNumber === stepNumber ? '#1976d2' : 'transparent'}`,
                color:
                  stepNumber > currentStepNumber
                    ? 'text.disabled'
                    : 'text.primary',
                backgroundColor:
                  stepNumber < currentStepNumber
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
                {mapASTStepToDescription(step)}
              </Typography>
            </Box>
          );
        })}
        {showFinish && (
          <Button variant={'contained'} onClick={goBack}>
            Finish
          </Button>
        )}
      </Stack>
    </>
  );
};

export default ProgramSupport;
