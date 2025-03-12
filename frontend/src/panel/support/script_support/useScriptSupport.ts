import { useEffect, useRef, useState } from 'react';
import { SupportDialogProps } from './components/SupportDialog';
import { LevelOfSupport } from './userStruggleSupport/userSupportMII';
import {
  addStepCompletedListener,
  addUserStruggleDataListener,
} from '../../../common/receiveMessage';
import { UserStruggleData } from '../../../common/message';
import { ASTInstruction } from '../../models/AST/Instruction';
import {
  sendNextPossibleStepsMessage,
  sendEndSupportMessage,
  sendStartSupportMessage,
} from '../../../common/sendMessage';
import {
  getVisibleInstructions,
  getNextPossibleSteps,
} from '../../models/AST/getters';
import { useTabContext } from '../../contexts/contextHooks';
import { ASTProgram } from '../../models/AST/AST';
import { performBestSystemAction } from './userStruggleSupport/supportAction';
import { TabInfo } from '../../contexts/TabContext';
import { StateRef, StateSetter } from '../../models/utilTypes';

const useScriptSupport = (program: ASTProgram) => {
  const { tab } = useTabContext();

  const [supportActive, setSupportActive] = useState(false);
  const [levelOfSupport, setLevelOfSupport] = useState<LevelOfSupport>('text');
  const [visibleInstructions, setVisibleInstructions] = useState(
    getVisibleInstructions(program.start.start, 0),
  );
  const nextPossibleSteps = useRef<ASTInstruction[]>([]);

  useEffect(
    () =>
      onSupportChange(
        supportActive,
        levelOfSupport,
        nextPossibleSteps.current,
        tab,
      ),
    [supportActive, levelOfSupport, tab],
  );

  useEffect(
    () =>
      onVisibleInstructionsChange(visibleInstructions, tab, nextPossibleSteps),
    [visibleInstructions, tab],
  );

  const [supportDialogDetails, setSupportDialogDetails] =
    useState<SupportDialogProps>({
      open: false,
      onClose: () =>
        setSupportDialogDetails((prev) => ({ ...prev, open: false })),
      aboutChange: 'inc',
      onAction: () => setLevelOfSupport((prev) => prev),
    });

  const messageListenersAdded = useRef(false);
  const [userStruggleData, setUserStruggleData] = useState<
    UserStruggleData | undefined
  >(undefined);
  const [stepCompleted, setStepCompleted] = useState<
    ASTInstruction | undefined
  >(undefined);

  useEffect(() => {
    console.log('Adding support message listeners');
    messageListenersAdded.current = true;
    addUserStruggleDataListener(setUserStruggleData);
    addStepCompletedListener(setStepCompleted);
  }, []);

  useEffect(() => {
    if (userStruggleData) {
      performBestSystemAction(
        userStruggleData,
        setLevelOfSupport,
        setSupportDialogDetails,
      );
    }
  }, [userStruggleData]);

  useEffect(
    () =>
      onStepCompletedChange(
        stepCompleted,
        nextPossibleSteps,
        setStepCompleted,
        setVisibleInstructions,
      ),
    [stepCompleted],
  );

  return {
    supportDialogDetails,
    visibleInstructions,
    setVisibleInstructions,
    levelOfSupport,
    setLevelOfSupport,
    supportActive,
    setSupportActive,
    tab,
  };
};

const onVisibleInstructionsChange = (
  visibleInstructions: ASTInstruction[],
  tab: TabInfo,
  nextPossibleSteps: StateRef<ASTInstruction[]>,
) => {
  console.log(visibleInstructions);
  const nextSteps = getNextPossibleSteps(visibleInstructions);
  nextPossibleSteps.current = nextSteps;
  console.log(nextSteps);

  if (tab.scriptStatus === 'loaded') {
    if (nextSteps.length > 0) {
      sendNextPossibleStepsMessage(tab.id, nextSteps);
    } else {
      const lastInstruction = visibleInstructions.at(-1);
      if (lastInstruction && lastInstruction.stage === 'complete') {
        sendEndSupportMessage(tab.id);
      }
    }
  }
};

const onSupportChange = (
  supportActive: boolean,
  levelOfSupport: LevelOfSupport,
  nextPossibleSteps: ASTInstruction[],
  tab: TabInfo,
) => {
  console.log('Tab/supportActive/levelOfSupport changed. Sending message.');
  if (tab.scriptStatus === 'loaded') {
    if (supportActive) {
      sendStartSupportMessage(tab.id, levelOfSupport);
      sendNextPossibleStepsMessage(tab.id, nextPossibleSteps);
    } else {
      sendEndSupportMessage(tab.id);
    }
  }
};

const onStepCompletedChange = (
  stepCompleted: ASTInstruction | undefined,
  nextPossibleSteps: StateRef<ASTInstruction[]>,
  setStepCompleted: StateSetter<ASTInstruction | undefined>,
  setVisibleInstructions: StateSetter<ASTInstruction[]>,
) => {
  const nextSteps = nextPossibleSteps.current;
  if (stepCompleted && nextSteps.length > 0) {
    const validStepNumbers = nextSteps.map((step) => step.stepNumber);
    if (validStepNumbers.includes(stepCompleted.stepNumber)) {
      setVisibleInstructions((prev) =>
        prev.map((instr) => {
          if (instr.stepNumber <= stepCompleted.stepNumber) {
            return { ...instr, stage: 'complete' };
          } else if (instr.stepNumber === stepCompleted.stepNumber + 1) {
            console.log(instr.stepNumber, stepCompleted.stepNumber);
            return { ...instr, stage: 'next' };
          } else {
            return instr;
          }
        }),
      );
    }
    setStepCompleted(undefined);
  }
};

export default useScriptSupport;
