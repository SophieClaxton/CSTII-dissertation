import { CSTProgram } from '../CST/CST';
import Annotation from './Annotation';
import User from './User';
import Website from './Website';

interface UnpublishedTaskWorkflowBase {
  id: number;
  title: string;
  created_at: string;
  description?: string;
}

type UnpublishedTaskWorkflowWithWebsite = UnpublishedTaskWorkflowBase & {
  website?: Website;
};
type UnpublishedTaskWorkflow = UnpublishedTaskWorkflowWithWebsite & {
  author: User;
  program: CSTProgram;
  published_script_id?: number;
  annotations: Annotation[];
};

interface UpdateUnpublishedTaskWorkflowRequest {
  title?: string;
  description?: string;
  website_id?: number;
  program?: CSTProgram;
  published_script_id?: number;
}

export type {
  UnpublishedTaskWorkflowBase,
  UnpublishedTaskWorkflowWithWebsite,
  UnpublishedTaskWorkflow,
  UpdateUnpublishedTaskWorkflowRequest,
};
