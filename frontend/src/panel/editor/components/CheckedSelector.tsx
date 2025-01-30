import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import { CSTInnerStepId } from '../../models/CST/CST';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import Switch from '@mui/material/Switch/Switch';
import { useState } from 'react';

interface CheckedSelectorProps {
  stepId: CSTInnerStepId;
  isChecked: boolean;
}

const CheckedSelector: React.FC<CheckedSelectorProps> = ({ isChecked }) => {
  // const { dispatch } = useUnpublishedScriptContext();
  const [checked, setChecked] = useState(isChecked ?? false);

  return (
    <FormGroup>
      <FormControlLabel
        label={'Selected'}
        control={
          <Switch
            checked={checked}
            onChange={(event) => {
              setChecked(event.target.checked);
            }}
            size={'small'}
          />
        }
        sx={{ padding: 0, margin: 0 }}
        slotProps={{ typography: { variant: 'caption' } }}
      />
    </FormGroup>
  );
};

export default CheckedSelector;
