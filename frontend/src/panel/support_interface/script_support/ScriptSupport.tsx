import Divider from '@mui/material/Divider/Divider';
import ScriptDetails from './components/ScriptDetails';
import LevelOfSupportDetails from './components/LevelOfSupportDetails';
import SupportActionDialog from './user_support/script_feedback/SupportActionDialog';
import SupportButton from './components/SupportButton';
import InstructionsDisplay from './components/InstructionsDisplay';
import useScriptSupport from './useScriptSupport';
import { Script } from '../../models/api/Script';
import FeedbackActionDialog from './user_support/script_feedback/FeedbackActionDialog';

interface ScriptSupportProps {
  script: Script;
}

const ScriptSupport: React.FC<ScriptSupportProps> = ({ script }) => {
  const {
    supportActionDialogDetails,
    feedbackActionDialogDetails,
    visibleInstructions,
    setVisibleInstructions,
    levelOfSupport,
    setLevelOfSupport,
    supportActive,
    setSupportActive,
    setStepCompleted,
    tab,
  } = useScriptSupport(script.program);

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
        }}
      />

      <SupportActionDialog {...supportActionDialogDetails} />
      <FeedbackActionDialog {...feedbackActionDialogDetails} />
    </>
  );
};

export default ScriptSupport;
