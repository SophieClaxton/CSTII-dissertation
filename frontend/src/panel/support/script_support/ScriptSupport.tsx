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
  const [providingSupport, setProvidingSupport] = useState(false);
  useEffect(() => {
    console.log('Tab updated, resending support message');
    if (providingSupport) {
      sendStartSupportMessage(tab.id!);
    } else {
      sendEndSupportMessage(tab.id!);
    }
  }, [providingSupport, tab]);

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
                {providingSupport ? 'End' : 'Start'}
              </Button>
              {tab.url != script.website.url && (
                <Alert severity={'info'} sx={{ marginTop: '0.5rem' }}>
                  You need to be on{' '}
                  <Link href={script.website.url}>{script.website.url}</Link> to
                  use this script
                </Alert>
              )}
              <Divider
                flexItem
                sx={{ marginTop: '1rem', marginBottom: '1rem' }}
              />
              {providingSupport && <ProgramSupport program={script.program} />}
            </>
          );
        }}
      />
    </Page>
  );
};

export default ScriptSupport;
