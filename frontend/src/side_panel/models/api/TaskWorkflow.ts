import { ASTProgram } from '../AST/AST';
import User from './User';
import Website from './Website';

interface BaseTaskWorkflow {
  id: number;
  title: string;
  created_at: Date;
  description: string;
}

type TaskWorkflowWithAuthor = BaseTaskWorkflow & { author: User };
type TaskWorkflowWithWebsite = BaseTaskWorkflow & { website: Website };
type TaskWorkflowWithAuthorAndWebsite = TaskWorkflowWithAuthor &
  TaskWorkflowWithWebsite;
type TaskWorkflow = TaskWorkflowWithAuthorAndWebsite & {
  program: ASTProgram;
};

interface UpdateTaskWorkflowRequest {
  title: string;
  description: string;
  program: ASTProgram;
  website_id: number;
}

interface PublishTaskWorkflowRequest extends UpdateTaskWorkflowRequest {
  author_id: number;
  created_at: string;
}

export type {
  BaseTaskWorkflow,
  TaskWorkflowWithAuthor,
  TaskWorkflowWithWebsite,
  TaskWorkflowWithAuthorAndWebsite,
  TaskWorkflow,
  PublishTaskWorkflowRequest,
  UpdateTaskWorkflowRequest,
};
