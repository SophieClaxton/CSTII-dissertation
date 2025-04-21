import { useEffect, useRef, useState } from 'react';
import { SupportActionDialogProps } from '../../mixed_initiative_interaction/script_feedback/SupportActionDialog';
import {
  addStepCompletedListener,
  addUserStruggleDataListener,
} from '../../../messaging/receiveMessage';
import { UserStruggleData } from '../../../messaging/message';
import { ASTInstruction } from '../../models/AST/Instruction';
import {
  sendNextPossibleStepsMessage,
  sendEndSupportMessage,
  sendStartSupportMessage,
} from '../../../messaging/sendMessage';
import {
  getVisibleInstructions,
  getNextPossibleSteps,
} from '../../models/AST/getters';
import { useTabContext } from '../../contexts/contextHooks';
import { ASTProgram } from '../../models/AST/AST';
import { TabInfo } from '../../contexts/TabContext';
import { StateRef, StateSetter } from '../../models/utilTypes';
import {
  LevelOfSupport,
  mapScriptLocationToString,
  ScriptLocation,
} from '../../models/support_and_MII/UserSupport';
import { performBestStruggleSupportAction } from '../../mixed_initiative_interaction/struggle_support/userSupportMII';
import { FeedbackActionDialogProps } from '../../mixed_initiative_interaction/script_feedback/FeedbackActionDialog';
import { StruggleEvidenceDuration } from '../../../content_scripts/consts';
import { performBestScriptFeedbackAction } from '../../mixed_initiative_interaction/script_feedback/scriptFeedbackMII';
import { annotateScript } from '../../api/scripts';

const useScriptSupport = (scriptId: number, program: ASTProgram) => {
  const { tab } = useTabContext();

  const [supportActive, setSupportActive] = useState(false);
  const [levelOfSupport, setLevelOfSupport] = useState<LevelOfSupport>('text');
  const levelOfSupportRef = useRef<LevelOfSupport>(levelOfSupport);
  const currentScriptLocation = useRef<ScriptLocation>({
    stepNumber: 0,
    decisionHistory: [],
  });
  const stepsCompletedInPeriod = useRef<number>(0);
  const lastMIIAt = useRef<number>(Date.now());

  const [visibleInstructions, setVisibleInstructions] = useState(
    getVisibleInstructions(program.start.start, 0),
  );
  const nextPossibleSteps = useRef<ASTInstruction[]>([]);

  useEffect(() => {
    levelOfSupportRef.current = levelOfSupport;
    onSupportChange(
      supportActive,
      levelOfSupport,
      nextPossibleSteps.current,
      tab,
    );
  }, [supportActive, levelOfSupport, tab]);

  useEffect(
    () =>
      onVisibleInstructionsChange(visibleInstructions, tab, nextPossibleSteps),
    [visibleInstructions, tab],
  );

  const [supportActionDialogDetails, setSupportActionDialogDetails] =
    useState<SupportActionDialogProps>({
      open: false,
      onClose: () =>
        setSupportActionDialogDetails((prev) => ({ ...prev, open: false })),
      action: 'none',
    });
  const [feedbackActionDialogDetails, setFeedbackActionDialogDetails] =
    useState<FeedbackActionDialogProps>({
      open: false,
      onClose: () =>
        setSupportActionDialogDetails((prev) => ({ ...prev, open: false })),
      action: 'none',
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
      receiveUserStruggleData(
        userStruggleData,
        lastMIIAt,
        levelOfSupportRef,
        stepsCompletedInPeriod,
        setLevelOfSupport,
        setSupportActionDialogDetails,
        setFeedbackActionDialogDetails,
        scriptId,
        mapScriptLocationToString(currentScriptLocation.current),
      );
    }
  }, [userStruggleData, scriptId]);

  useEffect(() => {
    stepsCompletedInPeriod.current += 1;
    onStepCompletedChange(
      stepCompleted,
      nextPossibleSteps,
      setStepCompleted,
      setVisibleInstructions,
      currentScriptLocation,
    );
  }, [stepCompleted]);

  return {
    supportActionDialogDetails,
    feedbackActionDialogDetails,
    currentScriptLocation,
    visibleInstructions,
    setVisibleInstructions,
    levelOfSupport,
    setLevelOfSupport,
    supportActive,
    setSupportActive,
    tab,
    setStepCompleted,
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

  if (nextSteps.length > 0) {
    sendNextPossibleStepsMessage(tab.id, nextSteps);
  } else {
    const lastInstruction = visibleInstructions.at(-1);
    if (lastInstruction && lastInstruction.stage === 'complete') {
      sendEndSupportMessage(tab.id);
    }
  }
};

const onSupportChange = (
  supportActive: boolean,
  levelOfSupport: LevelOfSupport,
  nextPossibleSteps: ASTInstruction[],
  tab: TabInfo,
) => {
  console.log('Tab/supportActive/levelOfSupport changed.');
  if (tab.scriptStatus === 'loaded') {
    console.log('Sending message.');
    if (supportActive) {
      sendStartSupportMessage(tab.id, levelOfSupport);
      sendNextPossibleStepsMessage(tab.id, nextPossibleSteps);
    } else {
      sendEndSupportMessage(tab.id);
    }
  } else {
    console.log('Tab status is not loaded');
  }
};

const onStepCompletedChange = (
  stepCompleted: ASTInstruction | undefined,
  nextPossibleSteps: StateRef<ASTInstruction[]>,
  setStepCompleted: StateSetter<ASTInstruction | undefined>,
  setVisibleInstructions: StateSetter<ASTInstruction[]>,
  currentPositionInScript: StateRef<ScriptLocation>,
) => {
  console.log('Step was completed');
  const nextSteps = nextPossibleSteps.current;
  if (stepCompleted && nextSteps.length > 0) {
    const validStepNumbers = nextSteps.map((step) => step.stepNumber);
    if (validStepNumbers.includes(stepCompleted.stepNumber)) {
      currentPositionInScript.current = {
        ...currentPositionInScript.current,
        stepNumber: stepCompleted.stepNumber + 1,
      };
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

const receiveUserStruggleData = (
  userStruggleData: UserStruggleData,
  lastMIIAt: StateRef<number>,
  levelOfSupportRef: StateRef<LevelOfSupport>,
  stepsCompleted: StateRef<number>,
  setLevelOfSupport: StateSetter<LevelOfSupport>,
  setSupportActionDialogDetails: StateSetter<SupportActionDialogProps>,
  setFeedbackActionDialogDetails: StateSetter<FeedbackActionDialogProps>,
  scriptId: number,
  currentPositionInScript: string,
) => {
  const now = Date.now();
  if (now - lastMIIAt.current < 0.95 * StruggleEvidenceDuration) {
    return;
  }
  lastMIIAt.current = now;
  performBestStruggleSupportAction(
    userStruggleData,
    levelOfSupportRef.current,
    stepsCompleted.current,
    setLevelOfSupport,
    setSupportActionDialogDetails,
  );
  setTimeout(
    () =>
      performBestScriptFeedbackAction(
        userStruggleData,
        levelOfSupportRef.current,
        stepsCompleted.current,
        setFeedbackActionDialogDetails,
        () =>
          annotateScript(scriptId, {
            location: currentPositionInScript,
            description: 'Users using support are getting stuck here',
          }),
      ),
    0.45 * StruggleEvidenceDuration,
  );
  stepsCompleted.current = 0;
};

export default useScriptSupport;
