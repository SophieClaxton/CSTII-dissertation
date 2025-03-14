import {
  levelsOfSupport,
  LevelOfSupport,
} from '../userStruggleSupport/userSupportMII';
import { StateSetter } from '../../../models/utilTypes';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import Slider from '@mui/material/Slider/Slider';
import { LoSDescription } from '../userStruggleSupport/levelOfSupportUtils';

interface LevelOfSupportDetailsProps {
  levelOfSupport: LevelOfSupport;
  setLevelOfSupport: StateSetter<LevelOfSupport>;
}

const LevelOfSupportDetails: React.FC<LevelOfSupportDetailsProps> = ({
  levelOfSupport,
  setLevelOfSupport,
}) => {
  return (
    <>
      <Stack
        direction={'row'}
        sx={{
          gap: '1rem',
          width: '100%',
          padding: '1rem',
        }}
      >
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant={'body2'} sx={{ textWrap: 'nowrap' }}>
            Level of Support
          </Typography>
          <Slider
            aria-label={'Level of Support'}
            getAriaValueText={(value: number) => `Level ${value}`}
            value={levelsOfSupport.indexOf(levelOfSupport)}
            onChangeCommitted={(_, value) =>
              setLevelOfSupport(
                levelsOfSupport[value as number] as LevelOfSupport,
              )
            }
            step={1}
            min={0}
            max={2}
            marks={[
              { value: 0, label: 'Text' },
              { value: 1, label: 'Hints' },
              { value: 2, label: 'Auto' },
            ]}
            size={'small'}
            sx={{
              width: '6rem',
              marginLeft: '1rem',
              marginRight: '1rem',
            }}
          />
        </Stack>
        <Typography variant={'subtitle2'} textAlign={'left'}>
          {LoSDescription[levelOfSupport]}
        </Typography>
      </Stack>
    </>
  );
};

export default LevelOfSupportDetails;
