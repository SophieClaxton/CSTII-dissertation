import { Schema } from '../Schema';
import {
  ASTCheckNode,
  ASTDragNode,
  ASTDrawNode,
  ASTNodeType,
  ASTSelectNode,
  ASTStepBase,
  ASTWriteNode,
} from './AST';

const astStepBaseSchema: Schema<ASTStepBase & { type: ASTNodeType }> = {
  type: true,
  element: true,
  next: false,
  comment: false,
};

const astDragNodeSchema: Schema<ASTDragNode> = {
  element: true,
  location: true,
  next: false,
  comment: false,
  type: true,
};

const astWriteNodeSchema: Schema<ASTWriteNode> = {
  element: true,
  description: false,
  text: true,
  isExact: true,
  next: false,
  comment: false,
  type: true,
};

const astSelectNodeSchema: Schema<ASTSelectNode> = {
  element: true,
  description: false,
  option: true,
  next: false,
  comment: false,
  type: true,
};

const astCheckNodeSchema: Schema<ASTCheckNode> = {
  element: true,
  description: false,
  isChecked: true,
  next: false,
  comment: false,
  type: true,
};

const astDrawNodeSchema: Schema<ASTDrawNode> = {
  element: true,
  description: true,
  next: false,
  comment: false,
  type: true,
};

export {
  astStepBaseSchema,
  astDragNodeSchema,
  astWriteNodeSchema,
  astSelectNodeSchema,
  astCheckNodeSchema,
  astDrawNodeSchema,
};
