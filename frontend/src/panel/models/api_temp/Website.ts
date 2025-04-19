import { ScriptWithAuthor } from './Script';

interface Website {
  id: number;
  url: string;
  description: string;
}

interface WebsiteWithScripts extends Website {
  scripts: ScriptWithAuthor[];
}

interface WebsiteRequest {
  url: string;
  description: string;
}

export default Website;
export type { WebsiteWithScripts, WebsiteRequest };
