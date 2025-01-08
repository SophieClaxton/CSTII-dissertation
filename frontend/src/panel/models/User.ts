import { ScriptWithWebsite } from './Script';

interface User {
  id: number;
  name: string;
}

interface PublicUserWithScripts extends User {
  scripts: ScriptWithWebsite[];
}

export default User;
export type { PublicUserWithScripts };
