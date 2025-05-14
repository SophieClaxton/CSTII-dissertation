import Divider from '@mui/material/Divider/Divider';
import WorkflowDetails from './components/WorkflowDetails';
import LevelOfSupportDetails from './components/LevelOfSupportDetails';
import SupportActionDialog from '../../mixed_initiative_interaction/metacognitive_support/SupportActionDialog';
import SupportButton from './components/SupportButton';
import InstructionsDisplay from './components/InstructionsDisplay';
import useWorkflowSupport from './useWorkflowSupport';
import { TaskWorkflow } from '../../models/api/TaskWorkflow';
import FeedbackActionDialog from '../../mixed_initiative_interaction/consultation_trigger/FeedbackActionDialog';
// import FeedbackButton from './components/FeedbackButton';

interface WorkflowSupportProps {
  workflow: TaskWorkflow;
}

const WorkflowSupport: React.FC<WorkflowSupportProps> = ({ workflow }) => {
  const {
    supportActionDialogDetails,
    feedbackActionDialogDetails,
    currentWorkflowLocation,
    visibleInstructions,
    setVisibleInstructions,
    levelOfSupport,
    setLevelOfSupport,
    supportActive,
    setSupportActive,
    setStepCompleted,
    tab,
  } = useWorkflowSupport(workflow.id, workflow.program);

  return (
    <>
      {!supportActive && <WorkflowDetails workflow={workflow} />}

      <SupportButton
        supportActive={supportActive}
        setSupportActive={setSupportActive}
        workflowURL={workflow.website.url}
        tab={tab}
      />

      <Divider flexItem sx={{ marginTop: '1rem' }} />

      <LevelOfSupportDetails {...{ levelOfSupport, setLevelOfSupport }} />

      <Divider flexItem />

      <InstructionsDisplay
        {...{
          supportActive,
          visibleInstructions,
          setVisibleInstructions,
          setStepCompleted,
          currentWorkflowLocation,
        }}
      />

      {/* {supportActive && (
        <FeedbackButton
          scriptId={script.id}
          scriptLocation={currentWorkflowLocation.current}
        />
      )} */}

      <SupportActionDialog {...supportActionDialogDetails} />
      <FeedbackActionDialog {...feedbackActionDialogDetails} />
    </>
  );
};

export default WorkflowSupport;
