import Divider from '@mui/material/Divider/Divider';
import ScriptDetails from './components/ScriptDetails';
import LevelOfSupportDetails from './components/LevelOfSupportDetails';
import SupportActionDialog from '../../mixed_initiative_interaction/struggle_support/SupportActionDialog';
import SupportButton from './components/SupportButton';
import InstructionsDisplay from './components/InstructionsDisplay';
import useScriptSupport from './useScriptSupport';
import { Script } from '../../models/api/Script';
import FeedbackActionDialog from '../../mixed_initiative_interaction/script_feedback/FeedbackActionDialog';
// import FeedbackButton from './components/FeedbackButton';

interface ScriptSupportProps {
  script: Script;
}

const ScriptSupport: React.FC<ScriptSupportProps> = ({ script }) => {
  const {
    supportActionDialogDetails,
    feedbackActionDialogDetails,
    currentScriptLocation,
    visibleInstructions,
    setVisibleInstructions,
    levelOfSupport,
    setLevelOfSupport,
    supportActive,
    setSupportActive,
    setStepCompleted,
    tab,
  } = useScriptSupport(script.id, script.program);

  return (
    <>
      {!supportActive && <ScriptDetails script={script} />}

      <SupportButton
        supportActive={supportActive}
        setSupportActive={setSupportActive}
        scriptUrl={script.website.url}
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
          currentScriptLocation,
        }}
      />

      {/* {supportActive && (
        <FeedbackButton
          scriptId={script.id}
          scriptLocation={currentScriptLocation.current}
        />
      )} */}

      <SupportActionDialog {...supportActionDialogDetails} />
      <FeedbackActionDialog {...feedbackActionDialogDetails} />
    </>
  );
};

export default ScriptSupport;
