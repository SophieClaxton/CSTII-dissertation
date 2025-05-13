import Button from '@mui/material/Button/Button';
import React from 'react';
import {
  mapWorkflowLocationToString,
  WorkflowLocation,
} from '../../../models/support_and_MII/UserSupport';
import { annotateTaskWorkflow } from '../../../api/taskWorkflows';

interface FeedbackButtonProps {
  workflowLocation: WorkflowLocation;
  workflowId: number;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  workflowLocation,
  workflowId,
}) => {
  return (
    <>
      <Button
        variant={'contained'}
        color={'warning'}
        size={'small'}
        sx={{ width: '50%', minWidth: '8rem' }}
        onClick={() =>
          annotateTaskWorkflow(workflowId, {
            location: mapWorkflowLocationToString(workflowLocation),
            description: 'Users using support are getting stuck here',
          })
        }
      >
        Notify the task workflow writer there might be a problem with the
        support
      </Button>
    </>
  );
};

export default FeedbackButton;
