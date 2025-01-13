import Annotation from './Annotation';
import { ASTProgram } from '../AST/AST';
import User from './User';
import Website from './Website';

interface BaseScript {
  id: number;
  title: string;
  created_at: Date;
  description: string;
}

type ScriptWithAuthor = BaseScript & { author: User };
type ScriptWithWebsite = BaseScript & { website: Website };
type ScriptWithAuthorAndWebsite = ScriptWithAuthor & ScriptWithWebsite;
type Script = ScriptWithAuthorAndWebsite & {
  program: ASTProgram;
  annotations: Annotation[];
};

interface UpdateScriptRequest {
  title: string;
  description: string;
  program: ASTProgram;
  website_id: number;
}

interface PublishScriptRequest extends UpdateScriptRequest {
  author_id: number;
  created_at: string;
}

export type {
  BaseScript,
  ScriptWithAuthor,
  ScriptWithWebsite,
  ScriptWithAuthorAndWebsite,
  Script,
  PublishScriptRequest,
  UpdateScriptRequest,
};
