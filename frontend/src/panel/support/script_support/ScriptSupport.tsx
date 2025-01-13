import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
import APIResponse from '../../models/API/APIResponse';
import { Script } from '../../models/API/Script';
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

const ScriptSupport: React.FC = () => {
  const { currentScreen } = useNavigationContext();
  assertIsScriptSupportScreen(currentScreen);

  const [scriptData, setScriptData] = useState<APIResponse<Script>>({
    status: 'Loading',
  });
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const getData = async () => {
      const response = await getScript(currentScreen.params.scriptId);
      setScriptData(response);
    };
    const getCurrentUrl = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      setCurrentUrl(tab.url ?? '');
    };
    chrome.tabs.onUpdated.addListener(
      (_: number, changeInfo: chrome.tabs.TabChangeInfo) => {
        console.log('tab changed with info');
        if (changeInfo.status === 'complete') {
          getCurrentUrl();
        }
      },
    );
    getData();
    getCurrentUrl();
  }, [currentScreen]);

  return (
    <Page title={'Get Support'}>
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
                size={'large'}
                disabled={currentUrl != script.website.url}
                sx={{ width: '50%', minWidth: '8rem' }}
              >
                Start
              </Button>
              {currentUrl != script.website.url && (
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
              <ProgramSupport
                program={script.program}
                currentUrl={currentUrl}
              />
            </>
          );
        }}
      />
    </Page>
  );
};

export default ScriptSupport;
