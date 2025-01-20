import { ASTNode } from '../../../panel/models/AST/AST';
import {
  astCheckNodeSchema,
  astStepBaseSchema,
} from '../../../panel/models/AST/schemas';
import {
  CSTCheckNode,
  CSTNode,
  CSTReadNode,
  CSTStepNodeType,
} from '../../../panel/models/CST/CST';
import { Schema } from '../../../panel/models/Schema';

const checkNodeMissingElement: CSTCheckNode = {
  id: { parentId: { sectionId: 1 }, stepId: 1 },
  type: CSTStepNodeType.Check,
  isChecked: false,
};

const validReadNode: CSTReadNode = {
  id: { parentId: { sectionId: 2 }, stepId: 1 },
  type: CSTStepNodeType.Read,
  element: { outerHTML: '', tag: 'P', url: 'www.url.com' },
};

const objectsAndSchemas: {
  name: string;
  object: CSTNode;
  schema: Schema<ASTNode>;
  expectedOutcome: string[];
}[] = [
  {
    name: 'Check node missing element',
    object: checkNodeMissingElement,
    schema: astCheckNodeSchema,
    expectedOutcome: ['element'],
  },
  {
    name: 'Valid read node',
    object: validReadNode,
    schema: astStepBaseSchema,
    expectedOutcome: [],
  },
];

export { objectsAndSchemas };
