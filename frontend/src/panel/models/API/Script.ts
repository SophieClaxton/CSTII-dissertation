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

interface PublishScriptRequest {
  title: string;
  author_id: number;
  created_at: string;
  description: string;
  program: ASTProgram;
  website_id: number;
}

export type {
  BaseScript,
  ScriptWithAuthor,
  ScriptWithWebsite,
  ScriptWithAuthorAndWebsite,
  Script,
  PublishScriptRequest,
};
