import { CSTSectionNode, CSTStepNode } from '../../../models/CST/CST';
import EndStepNode from './EndStepNode';
import { getNodeChoices } from '../../../models/CST/getters';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';
import InnerStepContainer from '../InnerStepContainer';
import AddNodeButton from '../AddNodeButton';
import '../styles/section.css';
import Stack from '@mui/material/Stack/Stack';
import Link from '@mui/material/Link/Link';
import IconButton from '@mui/material/IconButton/IconButton';
import Delete from '@mui/icons-material/Delete';
import { EditorActionType } from '../../../models/EditorAction';
import { mapIdToString } from '../../../unpublishedScriptReducer/mappers/nodeIds';
import Paper from '@mui/material/Paper/Paper';

interface SectionProps {
  section: CSTSectionNode;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
  const { dispatch } = useUnpublishedScriptContext();

  return (
    <Paper
      id={mapIdToString(section.id)}
      elevation={4}
      sx={{
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        borderRadius: '1rem',
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Link variant={'caption'} href={section.url}>
          {section.url}
        </Link>
        <IconButton
          sx={{ padding: 0, borderRadius: '0.5rem' }}
          onClick={() =>
            dispatch({
              type: EditorActionType.DeleteSection,
              sectionId: section.id,
            })
          }
        >
          <Delete />
        </IconButton>
      </Stack>
      <InnerStepContainer
        innerSteps={section.innerSteps}
        parentId={section.id}
      />
      <AddNodeButton<CSTStepNode>
        onAdd={(step) => dispatch({ type: EditorActionType.AddStep, step })}
        nodeChoices={getNodeChoices(section)}
        stepWidth={true}
      />
      {section.endStep && <EndStepNode endStep={section.endStep} />}
    </Paper>
  );
};

export default SectionNode;
