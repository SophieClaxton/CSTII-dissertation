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
}

const InputDescription: React.FC<InputDescriptionProps> = ({
  getCurrentDescription,
  getIsExact,
  onDescriptionChangeEvent,
}) => {
  const { dispatch } = useUnpublishedScriptContext();

  const description = useMemo(getCurrentDescription, [getCurrentDescription]);
  const showIsExactSwitch = getIsExact != undefined;
  console.log(showIsExactSwitch);
  console.log(getIsExact);

  const [text, setText] = useState(description ?? '');
  const [isExact, setIsExact] = useState(
    showIsExactSwitch ? getIsExact() : false,
  );

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        gap: '1rem',
        width: 'calc(16rem - 9% - 1.625rem)',
      }}
    >
      <TextField
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => dispatch(onDescriptionChangeEvent(text, isExact))}
        size={'small'}
        placeholder={'Description'}
        fullWidth
        slotProps={{
          input: { sx: { backgroundColor: 'white' } },
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
              />
            }
            label={'Match exactly'}
            labelPlacement={'bottom'}
          />
        </FormGroup>
      )}
    </Stack>
  );
};

export default InputDescription;
