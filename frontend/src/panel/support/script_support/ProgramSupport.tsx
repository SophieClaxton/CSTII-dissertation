import { useEffect, useState } from 'react';
import { ASTProgram } from '../../models/AST/AST';
import {
  getNextPossibleSteps,
  getVisibleSteps,
} from '../../models/AST/getters';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box/Box';
import { mapASTStepToDescription } from '../../models/AST/mappers';
import {
  addStepCompletedListener,
  addUserStruggleDataListener,
} from '../../../common/receiveMessage';
import { sendNextPossibleStepsMessage } from '../../../common/sendMessage';
import { useTabContext } from '../../contexts/contextHooks';

interface ProgramSupportProps {
  program: ASTProgram;
  currentUrl: string;
}

const ProgramSupport: React.FC<ProgramSupportProps> = ({
  program,
  currentUrl,
}) => {
  const { tab } = useTabContext();
  const [baseStepNumber] = useState(0);
  const [currentStepNumber, setCurrentStepNumber] = useState(0);
  const [visibleSteps] = useState(getVisibleSteps(program.start.start));
  const [nextSteps, setNextSteps] = useState(
    getNextPossibleSteps(visibleSteps.slice(currentStepNumber)),
  );

  useEffect(() => {
    addUserStruggleDataListener();
    addStepCompletedListener((nextStepIndex) =>
      setCurrentStepNumber((prevState) => prevState + nextStepIndex + 1),
    );
  }, []);

  useEffect(() => {
    setNextSteps(getNextPossibleSteps(visibleSteps.slice(currentStepNumber)));
  }, [currentStepNumber, visibleSteps]);

  useEffect(() => {
    console.log('Sending next possible steps');
    sendNextPossibleStepsMessage(tab.id!, nextSteps);
  }, [tab, nextSteps]);

  return (
    <Stack direction={'column'} spacing={2} padding={'1rem'}>
      <p>{currentUrl}</p>
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
                stepNumber < currentStepNumber ? 'rgb(149, 242, 152)' : 'white',
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
    </Stack>
  );
};

export default ProgramSupport;
