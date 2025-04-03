import Divider from '@mui/material/Divider/Divider';
import ScriptDetails from './components/ScriptDetails';
import LevelOfSupportDetails from './components/LevelOfSupportDetails';
import SupportDialog from './components/SupportDialog';
import SupportButton from './components/SupportButton';
import InstructionsDisplay from './components/InstructionsDisplay';
import useScriptSupport from './useScriptSupport';
import { Script } from '../../models/API/Script';

interface ScriptSupportProps {
  script: Script;
}

const ScriptSupport: React.FC<ScriptSupportProps> = ({ script }) => {
  const {
    supportDialogDetails,
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

      <SupportDialog {...supportDialogDetails} />
    </>
  );
};

export default ScriptSupport;
