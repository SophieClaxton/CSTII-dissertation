import { ScriptWithWebsite } from './Script';
import { UnpublishedScriptWithWebsite } from './UnpublishedScript';

interface User {
  id: number;
  name: string;
}

interface PublicUserWithScripts extends User {
  scripts: ScriptWithWebsite[];
}

interface UserWithScripts extends PublicUserWithScripts {
  unpublished_scripts: UnpublishedScriptWithWebsite[];
}

export default User;
export type { PublicUserWithScripts, UserWithScripts };
