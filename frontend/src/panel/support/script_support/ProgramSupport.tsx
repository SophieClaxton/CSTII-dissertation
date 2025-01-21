import { useCallback, useEffect, useRef, useState } from 'react';
import { ASTNodeType, ASTProgram } from '../../models/AST/AST';
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
import {
  sendEndSupportMessage,
  sendNextPossibleStepsMessage,
} from '../../../common/sendMessage';
import {
  useNavigationContext,
  useTabContext,
} from '../../contexts/contextHooks';
import Button from '@mui/material/Button/Button';
import {
  decreaseLevelOfSupport,
  increaseLevelOfSupport,
  LevelOfSupport,
  SystemSupportAction,
} from './userSupportMII';
import { StateSetter } from '../../models/utilTypes';
import { LevelOfSupportDialogDetails } from './LevelOfSupportDialog';

interface ProgramSupportProps {
  program: ASTProgram;
  levelOfSupport: LevelOfSupport;
  setLevelOfSupport: StateSetter<LevelOfSupport>;
  setDialogDetails: StateSetter<LevelOfSupportDialogDetails>;
}

const ProgramSupport: React.FC<ProgramSupportProps> = ({
  program,
  setLevelOfSupport,
  setDialogDetails,
}) => {
  const { goBack } = useNavigationContext();
  const { tab } = useTabContext();
  const [baseStepNumber] = useState(0);
  const [currentStepNumber, setCurrentStepNumber] = useState(0);
  const [visibleSteps] = useState(getVisibleSteps(program.start.start));
  const [showFinish, setShowFinish] = useState(false);
  const prevNumberOfStepsCompleted = useRef(0);

  const getDeltaStepsCompleted = useRef(
    () =>
      currentStepNumber + baseStepNumber - prevNumberOfStepsCompleted.current,
  );

  const respondToAction = useCallback(
    (action: SystemSupportAction) => {
      switch (action) {
        case 'inc':
          setLevelOfSupport(increaseLevelOfSupport);
          break;
        case 'dec':
          setLevelOfSupport(decreaseLevelOfSupport);
          break;
        case 'inc_dialog':
          setDialogDetails({
            aboutChange: 'inc',
            onAction: () => setLevelOfSupport(increaseLevelOfSupport),
          });
          break;
        case 'dec_dialog':
          setDialogDetails({
            aboutChange: 'dec',
            onAction: () => setLevelOfSupport(decreaseLevelOfSupport),
          });
      }
    },
    [setDialogDetails, setLevelOfSupport],
  );

  useEffect(() => {
    console.log('Add listeners');
    addUserStruggleDataListener(
      getDeltaStepsCompleted.current,
      respondToAction,
    );
    addStepCompletedListener((nextStepIndex) =>
      setCurrentStepNumber((prevState) => prevState + nextStepIndex + 1),
    );
  }, [respondToAction]);

  useEffect(() => {
    const nextSteps = getNextPossibleSteps(
      visibleSteps.slice(currentStepNumber),
    );

    const [userDecisionNode] = nextSteps.filter(
      (step) => step.type === ASTNodeType.UserDecision,
    );

    console.log(
      `User decision ${userDecisionNode?.question}is a valid next step`,
    );
    if (tab.scriptStatus === 'loaded') {
      if (nextSteps.length > 0) {
        console.log('Sending next possible steps');
        sendNextPossibleStepsMessage(tab.id!, nextSteps);
      } else {
        sendEndSupportMessage(tab.id!);
        setShowFinish(true);
      }
    }
  }, [tab, currentStepNumber, visibleSteps]);

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
