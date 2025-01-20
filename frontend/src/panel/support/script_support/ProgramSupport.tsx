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
import { addUserStruggleDataListener } from '../../../common/receiveMessage';
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
  const [currentStepNumber] = useState(1);
  const [visibleSteps] = useState(getVisibleSteps(program.start.start));

  useEffect(addUserStruggleDataListener, []);
  useEffect(() => {
    console.log('Sending next possible steps');
    const nextSteps = getNextPossibleSteps(
      visibleSteps.slice(currentStepNumber),
    );
    sendNextPossibleStepsMessage(tab.id!, nextSteps);
  }, [tab, currentStepNumber, visibleSteps]);

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
              border:
                currentStepNumber === stepNumber ? '2px solid red' : 'none',
              color:
                stepNumber > currentStepNumber
                  ? 'text.disabled'
                  : stepNumber < currentStepNumber
                    ? 'success.dark'
                    : 'text.primary',
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
