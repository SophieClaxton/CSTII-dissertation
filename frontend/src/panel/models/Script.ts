import Annotation from './Annotation';
import { ASTProgram } from './AST';
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

export type {
  BaseScript,
  ScriptWithAuthor,
  ScriptWithWebsite,
  ScriptWithAuthorAndWebsite,
  Script,
};
