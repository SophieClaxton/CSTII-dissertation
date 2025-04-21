import { CSTProgram } from '../CST/CST';
import Annotation from './Annotation';
import User from './User';
import Website from './Website';

interface UnpublishedScriptBase {
  id: number;
  title: string;
  created_at: string;
  description?: string;
}

type UnpublishedScriptWithWebsite = UnpublishedScriptBase & {
  website?: Website;
};
type UnpublishedScript = UnpublishedScriptWithWebsite & {
  author: User;
  program: CSTProgram;
  published_script_id?: number;
  annotations: Annotation[];
};

interface UpdateUnpublishedScriptRequest {
  title?: string;
  description?: string;
  website_id?: number;
  program?: CSTProgram;
  published_script_id?: number;
}

export type {
  UnpublishedScriptBase,
  UnpublishedScriptWithWebsite,
  UnpublishedScript,
  UpdateUnpublishedScriptRequest,
};
