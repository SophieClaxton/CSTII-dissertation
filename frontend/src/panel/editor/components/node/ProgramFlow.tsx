import { EditorFollowStep, EditorProgram } from '../../../models/ProgramComponent';
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../../styles/program.css';
import '../../styles/section.css';
import SectionNode from './SectionNode';
import { useCallback, useState } from 'react';
import {
  mapEditorFollowStepToFollowNode,
  mapEditorSectionToSectionNode,
} from '../../../models/mappers/programComponentMapper';
import FollowNode from './FollowNode';
import { getFollowSteps } from '../../flowUtils/getNodes';
import { getFollowEdge } from '../../flowUtils/getEdges';

interface ProgramFlowProps {
  program: EditorProgram;
}

const ProgramFlow: React.FC<ProgramFlowProps> = ({ program }) => {
  const startNode: Node = {
    id: 'start',
    type: 'input',
    position: { x: 16, y: 16 },
    data: { label: 'START' },
    className: 'start-node',
  };
  const sectionNodes: Node[] = program.sections.map((section, index) =>
    mapEditorSectionToSectionNode(section, <SectionNode section={section} />, index),
  );
  const followSteps: EditorFollowStep[] = program.sections.map(getFollowSteps).flat();
  const followNodes: Node[] = followSteps.map((followNode) =>
    mapEditorFollowStepToFollowNode(followNode, <FollowNode step={followNode} />),
  );

  const initialEdge = { id: 'start-1', source: 'start', target: sectionNodes[0].id };
  const followEdges: Edge[] = followSteps.map(getFollowEdge);

  const [nodes, setNodes] = useState<Node[]>([startNode, ...sectionNodes, ...followNodes]);
  const [edges, setEdges] = useState<Edge[]>([initialEdge, ...followEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string }>[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <div className="program">
      <div className="program-meta-data">
        <h2>{program.name}</h2>
        <h3>{program.author}</h3>
        <h3>{program.dateCreated}</h3>
      </div>
      <div className="program-code">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ProgramFlow;
