import { CSTSubsectionNode } from '../../../../models/CST/CST';
import { getNodeChoices } from '../../../../models/CST/getters';
import { useUnpublishedWorkflowContext } from '../../../../contexts/contextHooks';
import AddNodeButton from '../AddNodeButton';
import InnerStepContainer from '../InnerStepContainer';
import EndStepNode from './EndStepNode';
import '../styles/subsection.css';
import { EditorActionType } from '../../../../models/EditorAction';
import Paper from '@mui/material/Paper/Paper';
import Typography from '@mui/material/Typography/Typography';

interface SubsectionNodeProps {
  subsection: CSTSubsectionNode;
}

const SubsectionNode: React.FC<SubsectionNodeProps> = ({ subsection }) => {
  const { dispatch } = useUnpublishedWorkflowContext();
  // console.log(`Rendering subsection node ${subsection.id}`);
  // console.log(subsection);
  return (
    <Paper
      elevation={0}
      variant={'outlined'}
      sx={{
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '0.5rem',
        backgroundColor: 'white',
      }}
    >
      <Typography variant={'subtitle2'}>{subsection.answer}</Typography>
      <InnerStepContainer
        innerSteps={subsection.innerSteps}
        parentId={subsection.id}
      />
      <AddNodeButton
        onAdd={(step) => dispatch({ type: EditorActionType.AddStep, step })}
        nodeChoices={getNodeChoices(subsection)}
        stepWidth={subsection.innerSteps.length > 0 || !!subsection.endStep}
      />
      {subsection.endStep && <EndStepNode endStep={subsection.endStep} />}
    </Paper>
  );
};

export default SubsectionNode;
