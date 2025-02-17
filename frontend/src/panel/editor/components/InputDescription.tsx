import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import Stack from '@mui/material/Stack/Stack';
import Switch from '@mui/material/Switch/Switch';
import TextField from '@mui/material/TextField/TextField';
import { useMemo, useState } from 'react';
import { EditorAction } from '../../models/EditorAction';
import { useUnpublishedScriptContext } from '../../contexts/contextHooks';

interface InputDescriptionProps {
  getCurrentDescription: () => string | undefined;
  getIsExact?: () => boolean;
  onDescriptionChangeEvent: (
    description: string,
    isExact: boolean,
  ) => EditorAction;
  placeholder: string;
}

const InputDescription: React.FC<InputDescriptionProps> = ({
  getCurrentDescription,
  getIsExact,
  onDescriptionChangeEvent,
  placeholder,
}) => {
  const { dispatch } = useUnpublishedScriptContext();

  const description = useMemo(getCurrentDescription, [getCurrentDescription]);
  const showIsExactSwitch = getIsExact != undefined;

  const [text, setText] = useState(description ?? '');
  const [isExact, setIsExact] = useState(
    showIsExactSwitch ? getIsExact() : false,
  );

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        gap: '0.25rem',
        width: '100%',
        padding: '0 5% 0 5%',
      }}
    >
      <TextField
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => dispatch(onDescriptionChangeEvent(text, isExact))}
        size={'small'}
        placeholder={placeholder}
        fullWidth
        slotProps={{
          input: { sx: { backgroundColor: 'white', padding: 0 } },
          htmlInput: { sx: { padding: '0.25rem 0.5rem' } },
        }}
        sx={{ alignSelf: 'center' }}
        multiline
      />
      {showIsExactSwitch && (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isExact}
                onChange={(event) => {
                  setIsExact(event.target.checked);
                  dispatch(
                    onDescriptionChangeEvent(text, event.target.checked),
                  );
                }}
                size={'small'}
              />
            }
            label={'Exact'}
            labelPlacement={'bottom'}
            sx={{ padding: 0, margin: 0 }}
            slotProps={{ typography: { variant: 'caption' } }}
          />
        </FormGroup>
      )}
    </Stack>
  );
};

export default InputDescription;
