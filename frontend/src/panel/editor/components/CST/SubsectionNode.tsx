import { CSTSubsectionNode } from '../../../models/CST/CST';
import { getNodeChoices } from '../../../models/CST/getters';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';
import AddNodeButton from '../AddNodeButton';
import InnerStepContainer from '../InnerStepContainer';
import EndStepNode from './EndStepNode';
import '../styles/subsection.css';
import { EditorActionType } from '../../../models/EditorAction';
import Paper from '@mui/material/Paper/Paper';

interface SubsectionNodeProps {
  subsection: CSTSubsectionNode;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  const { dispatch } = useUnpublishedScriptContext();
  // console.log(`Rendering subsection node ${subsection.id}`);
  // console.log(subsection);
  return (
    <Paper
      elevation={0}
      variant={'outlined'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      <p>{subsection.answer}</p>
      <InnerStepContainer
        innerSteps={subsection.innerSteps}
        parentId={subsection.id}
      />
      <AddNodeButton
        onAdd={(step) => dispatch({ type: EditorActionType.AddStep, step })}
        nodeChoices={getNodeChoices(subsection)}
      />
      {subsection.endStep && <EndStepNode endStep={subsection.endStep} />}
    </Paper>
  );
};

export default SubsectionNode;
