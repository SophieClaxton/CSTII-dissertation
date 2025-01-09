import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import { CSTFollowNode } from '../../../models/CST/CST';
import SectionNode from './SectionNode';
import { getFollowSteps } from '../../flowUtils/getNodes';
import { getFollowEdge } from '../../flowUtils/getEdges';
import './styles/program.css';
import { mapNodeIdToString } from '../../../models/CST/mappers';
import { useUnpublishedScriptContext } from '../../../contexts/contextHooks';
import Button from '@mui/material/Button/Button';

const ProgramFlow: React.FC = () => {
  const { unpublishedScript } = useUnpublishedScriptContext();
  const createdAtDate = new Date(unpublishedScript.created_at);
  const dateString = createdAtDate.toLocaleDateString();

  const initialEdge = {
    id: 'start-1',
    source: 'start',
    target: mapNodeIdToString(unpublishedScript.program.sections[0].id),
  };
  const followSteps: CSTFollowNode[] = unpublishedScript.program.sections
    .map(getFollowSteps)
    .flat();
  const followEdges = followSteps
    .map(getFollowEdge)
    .filter((edge) => edge != undefined);
  const edges = [initialEdge, ...followEdges];

  const updateArrows = useXarrow();

  return (
    <>
      <div className="program-meta-data">
        <h2>{unpublishedScript.title}</h2>
        <h3>{unpublishedScript.author.name}</h3>
        <h3>{dateString}</h3>
      </div>
      <Button variant={'contained'} onClick={() => {}}>
        Save
      </Button>
      <div className="program-code-env" onScroll={updateArrows}>
        <div className="program-code">
          <Xwrapper>
            <div className="start-block" id="start">
              START
            </div>
            {unpublishedScript.program.sections.map((section) => (
              <SectionNode section={section} />
            ))}
            {edges.map((edge) => (
              <Xarrow
                start={edge.source}
                end={edge.target}
                startAnchor={'bottom'}
                endAnchor={'top'}
              />
            ))}
          </Xwrapper>
        </div>
      </div>
    </>
  );
};

export default ProgramFlow;
