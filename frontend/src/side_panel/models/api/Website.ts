import { TaskWorkflowWithAuthor } from './TaskWorkflow';

interface Website {
  id: number;
  url: string;
  description: string;
}

interface WebsiteWithWorkflows extends Website {
  scripts: TaskWorkflowWithAuthor[];
}

interface WebsiteRequest {
  url: string;
  description: string;
}

export default Website;
export type { WebsiteWithWorkflows, WebsiteRequest };
