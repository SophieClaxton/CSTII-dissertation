import { useEffect, useState } from 'react';
import '../../panel.css';
import APIResponse from '../../models/API/APIResponse';
import { ScriptWithAuthorAndWebsite } from '../../models/API/Script';
import { getScripts } from '../../api/scripts';
import ScriptListItem from './ScriptListItem';
import './styles/scriptSelectionPage.css';
import List from '@mui/material/List/List';
import Website from '../../models/API/Website';
import User from '../../models/API/User';
import { getWebsites } from '../../api/websites';
import { getUsers } from '../../api/users';
import ScriptFilterDialog from './ScriptFilterDialog';
import FilterBar from './FilterBar';
import Loadable from '../../components/Loadable';
import Page from '../../components/Page';
import Stack from '@mui/material/Stack/Stack';

const ScriptSelectionPage: React.FC = () => {
  const [scriptsData, setScriptsData] = useState<
    APIResponse<ScriptWithAuthorAndWebsite[]>
  >({ status: 'Loading' });
  const [scripts, setScripts] = useState<ScriptWithAuthorAndWebsite[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [authors, setAuthors] = useState<User[]>([]);

  useEffect(() => {
    const getData = async () => {
      const scriptResponse = await getScripts();
      setScriptsData(scriptResponse);
      if (scriptResponse.status === 'Loaded') {
        setScripts(scriptResponse.data);
      }

      const websitesResponse = await getWebsites();
      if (websitesResponse.status == 'Loaded') {
        setWebsites(websitesResponse.data);
      }

      const usersRespose = await getUsers();
      if (usersRespose.status == 'Loaded') {
        setAuthors(usersRespose.data);
      }
    };
    getData();
  }, []);

  const [websiteFilters, setWebsiteFilters] = useState<Website[]>([]);
  const [authorFilters, setAuthorFilters] = useState<User[]>([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    if (scriptsData.status != 'Loaded') {
      return;
    }
    if (websiteFilters.length > 0 || authorFilters.length > 0) {
      setScripts(
        scriptsData.data.filter(
          (script) =>
            websiteFilters
              .map((website) => website.id)
              .includes(script.website.id) ||
            authorFilters.map((author) => author.id).includes(script.author.id),
        ),
      );
    } else {
      setScripts(scriptsData.data);
    }
  }, [scriptsData, websiteFilters, authorFilters]);

  return (
    <Page title={'Script Selection'}>
      <Loadable
        response={scriptsData}
        onLoad={() => (
          <Stack direction={'column'} spacing={1} padding={'0.5rem'}>
            <FilterBar
              setOpenFilterDialog={setOpenFilterDialog}
              websiteFilters={websiteFilters}
              setWebsiteFilters={setWebsiteFilters}
              authorFilters={authorFilters}
              setAuthorFilters={setAuthorFilters}
            />
            <List disablePadding>
              {scripts.map((script) => (
                <ScriptListItem script={script} />
              ))}
            </List>
          </Stack>
        )}
      />
      <ScriptFilterDialog
        open={openFilterDialog}
        setOpen={setOpenFilterDialog}
        websites={websites}
        authors={authors}
        websiteFilters={websiteFilters}
        setWebsiteFilters={setWebsiteFilters}
        authorFilters={authorFilters}
        setAuthorFilters={setAuthorFilters}
      />
    </Page>
  );
};

export default ScriptSelectionPage;
