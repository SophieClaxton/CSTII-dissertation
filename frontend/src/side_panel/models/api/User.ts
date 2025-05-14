import { TaskWorkflowWithWebsite } from './TaskWorkflow';
import { UnpublishedTaskWorkflowWithWebsite } from './UnpublishedTaskWorkflow';

interface User {
  id: number;
  name: string;
}

interface PublicUserWithWorkflows extends User {
  scripts: TaskWorkflowWithWebsite[];
}

interface UserWithWorkflows extends PublicUserWithWorkflows {
  unpublished_scripts: UnpublishedTaskWorkflowWithWebsite[];
}

export default User;
export type { PublicUserWithWorkflows, UserWithWorkflows };
