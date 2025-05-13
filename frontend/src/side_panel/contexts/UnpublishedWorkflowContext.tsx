import { createContext, useReducer } from 'react';
import { EditorAction } from '../models/EditorAction';
import { UnpublishedTaskWorkflow } from '../models/api/UnpublishedTaskWorkflow';
import { unpublishedTaskWorkflowReducer } from '../task_workflows/unpublished_task_workflow_reducer/unpublishedTaskWorkflowReducer';

interface UnpublishedWorkflowState {
  unpublishedWorkflow: UnpublishedTaskWorkflow;
  dispatch: React.Dispatch<EditorAction>;
}

const UnpublishedWorkflowContext = createContext<
  UnpublishedWorkflowState | undefined
>(undefined);

const UnpublishedWorkflowContextProvider: React.FC<
  React.PropsWithChildren & { script: UnpublishedTaskWorkflow }
> = ({ children, script }) => {
  const [editorProgram, dispatch] = useReducer(
    unpublishedTaskWorkflowReducer,
    script,
  );
  return (
    <UnpublishedWorkflowContext.Provider
      value={{ unpublishedWorkflow: editorProgram, dispatch: dispatch }}
    >
      {children}
    </UnpublishedWorkflowContext.Provider>
  );
};

export { UnpublishedWorkflowContext, UnpublishedWorkflowContextProvider };
