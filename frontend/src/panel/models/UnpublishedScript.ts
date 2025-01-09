import { CSTProgram } from './CST/CST';
import User from './User';
import Website from './Website';

interface UnpublishedScriptBase {
  id: number;
  title: string;
  created_at: Date;
  description?: string;
}

type UnpublishedScriptWithWebsite = UnpublishedScriptBase & {
  website?: Website;
};
type UnpublishedScript = UnpublishedScriptWithWebsite & {
  author: User;
  program: CSTProgram;
};

export type {
  UnpublishedScriptBase,
  UnpublishedScriptWithWebsite,
  UnpublishedScript,
};
