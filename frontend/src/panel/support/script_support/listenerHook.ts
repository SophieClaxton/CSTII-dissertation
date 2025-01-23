import { useEffect, useRef, useState } from 'react';
import {
  addUserStruggleDataListener,
  addStepCompletedListener,
} from '../../../common/receiveMessage';
import {
  SystemSupportAction,
  increaseLevelOfSupport,
  decreaseLevelOfSupport,
  LevelOfSupport,
} from './userSupportMII';
import {
  sendNextPossibleStepsMessage,
  sendEndSupportMessage,
} from '../../../common/sendMessage';
import { ASTNodeType, ASTProgram } from '../../models/AST/AST';
import {
  getVisibleSteps,
  getNextPossibleSteps,
} from '../../models/AST/getters';
import { useTabContext } from '../../contexts/contextHooks';
import { StateSetter } from '../../models/utilTypes';
import { LevelOfSupportDialogDetails } from './LevelOfSupportDialog';

const useAddStepCompletedListener = (
  program: ASTProgram,
  setLevelOfSupport: StateSetter<LevelOfSupport>,
  setDialogDetails: StateSetter<LevelOfSupportDialogDetails>,
) => {
  const { tab } = useTabContext();

  const [baseStepNumber] = useState(0);
  const [currentStepNumber, setCurrentStepNumber] = useState(0);
  const prevNumberOfStepsCompleted = useRef(0);

  const [visibleSteps] = useState(getVisibleSteps(program.start.start));

  const [showFinish, setShowFinish] = useState(false);

  const getDeltaStepsCompleted = useRef(
    () =>
      currentStepNumber + baseStepNumber - prevNumberOfStepsCompleted.current,
  );
  const setLevelOfSupportRef = useRef(setLevelOfSupport);
  const setDialogDetailsRef = useRef(setDialogDetails);
  const getCurrentStepNumber = useRef(() => currentStepNumber);

  // TODO: make respondToAction a ref
  // TODO: create a hook to manage updating the function refs

  useEffect(() => {
    getCurrentStepNumber.current = () => currentStepNumber;
    const nextSteps = getNextPossibleSteps(
      visibleSteps.slice(currentStepNumber),
      currentStepNumber,
    );

    const [_userDecisionNode] = nextSteps.filter(
      (step) => step.type === ASTNodeType.UserDecision,
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

  const respondToAction = useRef((action: SystemSupportAction) => {
    switch (action) {
      case 'inc':
        setLevelOfSupportRef.current(increaseLevelOfSupport);
        break;
      case 'dec':
        setLevelOfSupportRef.current(decreaseLevelOfSupport);
        break;
      case 'inc_dialog':
        setDialogDetailsRef.current({
          aboutChange: 'inc',
          onAction: () => setLevelOfSupportRef.current(increaseLevelOfSupport),
        });
        break;
      case 'dec_dialog':
        setDialogDetailsRef.current({
          aboutChange: 'dec',
          onAction: () => setLevelOfSupportRef.current(decreaseLevelOfSupport),
        });
    }
  });

  useEffect(() => {
    console.log('Add listeners');
    addUserStruggleDataListener(
      getDeltaStepsCompleted.current,
      respondToAction.current,
    );
    addStepCompletedListener(
      getCurrentStepNumber.current,
      (nextStepIndex: number) =>
        setCurrentStepNumber((prevState) => prevState + nextStepIndex),
    );
  }, []);

  return { baseStepNumber, currentStepNumber, visibleSteps, showFinish };
};

export { useAddStepCompletedListener };
