import Button from '@mui/material/Button/Button';
import { TabInfo } from '../../../contexts/TabContext';
import Alert from '@mui/material/Alert/Alert';
import { StateSetter } from '../../../models/utilTypes';
import Link from '@mui/material/Link/Link';
import React from 'react';
import { urlsMatch } from '../../../task_workflows/DSVPL_editor/task_workflow_utils/elementUtils';

interface SupportButtonProps {
  supportActive: boolean;
  setSupportActive: StateSetter<boolean>;
  workflowURL: string;
  tab: TabInfo;
}

const SupportButton: React.FC<SupportButtonProps> = ({
  supportActive,
  setSupportActive,
  workflowURL,
  tab,
}) => {
  return (
    <>
      <Button
        variant={'contained'}
        color={supportActive ? 'error' : 'primary'}
        size={'large'}
        disabled={!supportActive && !urlsMatch(tab.url, workflowURL)}
        sx={{ width: '50%', minWidth: '8rem' }}
        onClick={() => setSupportActive(!supportActive)}
      >
        {supportActive ? 'Stop Support' : 'Start'}
      </Button>
      {!urlsMatch(tab.url, workflowURL) && !supportActive && (
        <Alert severity={'info'} sx={{ marginTop: '0.5rem' }}>
          You need to be on <Link href={workflowURL}>{workflowURL}</Link> to use
          this task workflow
        </Alert>
      )}
    </>
  );
};

export default SupportButton;
