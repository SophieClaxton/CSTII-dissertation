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
  const currentInstruction = useRef<ASTInstruction | undefined>(
    getCurrentInstruction(visibleInstructions),
  );

  useEffect(
    () => onSupportChange(supportActive, levelOfSupport, tab),
    [supportActive, levelOfSupport, tab],
  );

  useEffect(
    () =>
      onVisibleInstructionsChange(visibleInstructions, tab, currentInstruction),
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
        currentInstruction,
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
  currentInstruction: StateRef<ASTInstruction | undefined>,
) => {
  const nextSteps = getNextPossibleSteps(visibleInstructions);

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

  currentInstruction.current = getCurrentInstruction(visibleInstructions);
};

const onSupportChange = (
  supportActive: boolean,
  levelOfSupport: LevelOfSupport,
  tab: TabInfo,
) => {
  console.log('Tab/supportActive/levelOfSupport changed. Sending message.');
  if (tab.scriptStatus === 'loaded') {
    if (supportActive) {
      sendStartSupportMessage(tab.id, levelOfSupport);
    } else {
      sendEndSupportMessage(tab.id);
    }
  }
};

const getCurrentInstruction = (visibleInstructions: ASTInstruction[]) => {
  return visibleInstructions.filter((instr) => instr.stage === 'next').at(0);
};

const onStepCompletedChange = (
  stepCompleted: ASTInstruction | undefined,
  currentInstruction: StateRef<ASTInstruction | undefined>,
  setStepCompleted: StateSetter<ASTInstruction | undefined>,
  setVisibleInstructions: StateSetter<ASTInstruction[]>,
) => {
  if (stepCompleted && currentInstruction.current) {
    if (stepCompleted.stepNumber >= currentInstruction.current.stepNumber) {
      setVisibleInstructions((prev) =>
        prev.map((instr) => {
          if (instr.stepNumber <= stepCompleted.stepNumber) {
            return { ...instr, stage: 'complete' };
          } else if (instr.stepNumber === stepCompleted.stepNumber + 1) {
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
