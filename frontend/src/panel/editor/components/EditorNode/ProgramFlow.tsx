import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import { EditorFollowStep } from '../../../models/programComponent/ProgramComponent';
import SectionNode from './SectionNode';
import { getFollowSteps } from '../../flowUtils/getNodes';
import { getFollowEdge } from '../../flowUtils/getEdges';
import './styles/program.css';
import { useEditorProgramContext } from '../../contexts/useEditorProgramContext';

const ProgramFlow: React.FC = () => {
  const { editorProgram: program } = useEditorProgramContext();
  console.log('Rendering ProgramFlow');

  const initialEdge = {
    id: 'start-1',
    source: 'start',
    target: program.sections[0].id,
  };
  const followSteps: EditorFollowStep[] = program.sections
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
        <h2>{program.name}</h2>
        <h3>{program.author}</h3>
        <h3>{program.dateCreated}</h3>
      </div>
      <div className="program-code-env" onScroll={updateArrows}>
        <div className="program-code">
          <Xwrapper>
            <div className="start-block" id="start">
              START
            </div>
            {program.sections.map((section) => (
              <SectionNode section={section} />
            ))}
            {edges.map((edge) => (
              <Xarrow
                start={edge.source}
                end={edge.target}
                startAnchor={'bottom'}
              />
            ))}
          </Xwrapper>
        </div>
      </div>
    </>
  );
};

export default ProgramFlow;
