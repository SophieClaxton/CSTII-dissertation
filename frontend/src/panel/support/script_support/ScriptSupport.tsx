import {
  useNavigationContext,
  useTabContext,
} from '../../contexts/contextHooks';
import { getScript } from '../../api/scripts';
import { assertIsScriptSupportScreen } from '../../navigation/screenChecks';
import Page from '../../components/Page';
import Loadable from '../../components/Loadable';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import Alert from '@mui/material/Alert/Alert';
import Link from '@mui/material/Link/Link';
import Divider from '@mui/material/Divider/Divider';
import Button from '@mui/material/Button/Button';
import ProgramSupport from './ProgramSupport';
import { useAPICall } from '../../api/apiHooks';
import { useEffect, useMemo, useState } from 'react';
import {
  sendEndSupportMessage,
  sendStartSupportMessage,
} from '../../../common/sendMessage';
import LevelOfSupportDialog, {
  LevelOfSupportDialogDetails,
} from './LevelOfSupportDialog';
import {
  LevelOfSupport,
  levelsOfSupport,
  LoSDescription,
} from './userSupportMII';
import Slider from '@mui/material/Slider/Slider';

const ScriptSupport: React.FC = () => {
  const { currentScreen } = useNavigationContext();
  assertIsScriptSupportScreen(currentScreen);
  const { tab } = useTabContext();

  const scriptData = useAPICall(
    useMemo(
      () => () => getScript(currentScreen.params.scriptId),
      [currentScreen],
    ),
  );
  const [providingSupport, setProvidingSupport] = useState<boolean | undefined>(
    undefined,
  );
  const [levelOfSupport, setLevelOfSupport] = useState<LevelOfSupport>('text');
  const [openLoSDialog, setOpenLoSDialog] = useState(false);
  const [dialogDetails, setDialogDetails] =
    useState<LevelOfSupportDialogDetails>({
      aboutChange: 'inc',
      onAction: () => undefined,
    });

  useEffect(() => {
    console.log('Tab updated, resending support message');
    console.log(tab.scriptStatus, providingSupport);
    if (tab.scriptStatus === 'loaded' && providingSupport != undefined) {
      if (providingSupport) {
        sendStartSupportMessage(tab.id!, levelOfSupport);
      } else {
        sendEndSupportMessage(tab.id!);
        setProvidingSupport(undefined);
      }
    }
  }, [providingSupport, tab, levelOfSupport]);

  return (
    <Page title={'Get Support'} onBack={() => sendEndSupportMessage(tab.id!)}>
      <Loadable
        response={scriptData}
        onLoad={(script) => {
          const createdAtDate = new Date(script.created_at);
          const dateString = createdAtDate.toLocaleDateString();

          return (
            <>
              <Stack
                direction={'column'}
                sx={{
                  gap: '0.25rem',
                  width: '100%',
                  padding: '1rem',
                }}
              >
                <Typography
                  variant={'h4'}
                  component={'h1'}
                  gutterBottom
                  sx={{ textAlign: 'left' }}
                >
                  {script.title}
                </Typography>
                <Typography
                  variant={'body1'}
                  gutterBottom
                  sx={{ textAlign: 'left' }}
                >
                  {script.description}
                </Typography>
                <Stack direction={'row'} spacing={3}>
                  <Typography variant={'subtitle2'}>
                    Author: {script.author.name}
                  </Typography>
                  <Typography variant={'subtitle2'}>
                    Created: {dateString}
                  </Typography>
                </Stack>
              </Stack>
              <Button
                variant={'contained'}
                color={providingSupport ? 'error' : 'primary'}
                size={'large'}
                disabled={!providingSupport && tab.url != script.website.url}
                sx={{ width: '50%', minWidth: '8rem' }}
                onClick={() => setProvidingSupport(!providingSupport)}
              >
                {providingSupport ? 'Stop Support' : 'Start'}
              </Button>
              {tab.url != script.website.url && !providingSupport && (
                <Alert severity={'info'} sx={{ marginTop: '0.5rem' }}>
                  You need to be on{' '}
                  <Link href={script.website.url}>{script.website.url}</Link> to
                  use this script
                </Alert>
              )}
              <Divider flexItem sx={{ marginTop: '1rem' }} />
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
              <Divider flexItem sx={{ marginBottom: '1rem' }} />
              {providingSupport && (
                <ProgramSupport
                  program={script.program}
                  {...{
                    setProvidingSupport,
                    setLevelOfSupport,
                    setDialogDetails,
                  }}
                />
              )}
              <LevelOfSupportDialog
                open={openLoSDialog}
                onClose={() => setOpenLoSDialog(false)}
                {...dialogDetails}
              />
            </>
          );
        }}
      />
    </Page>
  );
};

export default ScriptSupport;
