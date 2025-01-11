import { CSTSectionNode, CSTStepNode } from '../../../models/CST/CST';
import EndStepNode from './EndStepNode';
import { addEditorStepToSection } from '../../../models/CST/setters';
import { getNodeChoices } from '../../../models/CST/getters';
import { mapNodeIdToString } from '../../../models/CST/mappers';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';
import InnerStepContainer from '../InnerStepContainer';
import AddNodeButton from '../AddNodeButton';
import '../styles/section.css';
import Stack from '@mui/material/Stack/Stack';
import Link from '@mui/material/Link/Link';
import IconButton from '@mui/material/IconButton/IconButton';
import Delete from '@mui/icons-material/Delete';
import { EditorActionType } from '../../../models/EditorAction';

interface SectionProps {
  section: CSTSectionNode;
}

const SectionNode: React.FC<SectionProps> = ({ section }) => {
  const { dispatch } = useUnpublishedScriptContext();

  return (
    <div className="section" id={mapNodeIdToString(section.id)}>
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
        onAdd={(step) => addEditorStepToSection(dispatch, section, step)}
        nodeChoices={getNodeChoices(section)}
      />
      {section.endStep && <EndStepNode endStep={section.endStep} />}
    </div>
  );
};

export default SectionNode;
