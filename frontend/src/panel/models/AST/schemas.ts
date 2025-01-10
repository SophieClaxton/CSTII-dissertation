import {
  ASTCheckNode,
  ASTDragNode,
  ASTDrawNode,
  ASTNodeType,
  ASTSelectNode,
  ASTStepBase,
  ASTWriteNode,
} from './AST';

const astStepBaseSchema: Record<
  keyof (ASTStepBase & { type: ASTNodeType }),
  boolean
> = {
  type: true,
  element: true,
  next: false,
  comment: false,
};

const astDragNodeSchema: Record<keyof ASTDragNode, boolean> = {
  element: true,
  location: true,
  next: false,
  comment: false,
  type: true,
};

const astWriteNodeSchema: Record<keyof ASTWriteNode, boolean> = {
  element: true,
  description: false,
  text: true,
  next: false,
  comment: false,
  type: true,
};

const astSelectNodeSchema: Record<keyof ASTSelectNode, boolean> = {
  element: true,
  description: false,
  option: true,
  next: false,
  comment: false,
  type: true,
};

const astCheckNodeSchema: Record<keyof ASTCheckNode, boolean> = {
  element: true,
  description: false,
  isChecked: true,
  next: false,
  comment: false,
  type: true,
};

const astDrawNodeSchema: Record<keyof ASTDrawNode, boolean> = {
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
