import Button from '@mui/material/Button/Button';
import React from 'react';
import {
  mapScriptLocationToString,
  ScriptLocation,
} from '../../../models/support_and_MII/UserSupport';
import { annotateScript } from '../../../api/scripts';

interface FeedbackButtonProps {
  scriptLocation: ScriptLocation;
  scriptId: number;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  scriptLocation,
  scriptId,
}) => {
  return (
    <>
      <Button
        variant={'contained'}
        color={'warning'}
        size={'small'}
        sx={{ width: '50%', minWidth: '8rem' }}
        onClick={() =>
          annotateScript(scriptId, {
            location: mapScriptLocationToString(scriptLocation),
            description: 'Users using support are getting stuck here',
          })
        }
      >
        Notify the script writer there might be a problem with the script
      </Button>
    </>
  );
};

export default FeedbackButton;
