import { ASTNode } from '../../../panel/models/AST/AST';
import { astStepBaseSchema } from '../../../panel/models/AST/schemas';
import {
  CSTNode,
  CSTReadNode,
  CSTScrollToNode,
  CSTStepNodeType,
} from '../../../panel/models/CST/CST';
import { Schema } from '../../../panel/models/Schema';

const scrollToNodeMissingElement: CSTScrollToNode = {
  id: { parentId: { sectionId: 1 }, stepId: 1 },
  type: CSTStepNodeType.ScrollTo,
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
    name: 'Scrollt to node missing element',
    object: scrollToNodeMissingElement,
    schema: astStepBaseSchema,
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
