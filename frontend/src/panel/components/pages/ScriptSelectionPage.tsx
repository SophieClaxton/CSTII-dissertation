import { useEffect, useState } from 'react';
import { ScriptWithAuthorAndWebsite } from '../../models/api_temp/Script';
import { getScripts } from '../../api_temp/scripts';
import ScriptListItem from '../../support_interface/script_selection/ScriptListItem';
import List from '@mui/material/List/List';
import Website from '../../models/api_temp/Website';
import User from '../../models/api_temp/User';
import { getWebsites } from '../../api_temp/websites';
import { getUsers } from '../../api_temp/users';
import ScriptFilterDialog from '../../support_interface/script_selection/ScriptFilterDialog';
import FilterBar from '../../support_interface/script_selection/FilterBar';
import Loadable from '../Loadable';
import Page from '../Page';
import Stack from '@mui/material/Stack/Stack';
import { useAPICall } from '../../api_temp/apiHooks';

const ScriptSelectionPage: React.FC = () => {
  const scriptsData = useAPICall(getScripts);
  const websitesData = useAPICall(getWebsites);
  const authorsData = useAPICall(getUsers);

  const [scripts, setScripts] = useState<ScriptWithAuthorAndWebsite[]>([]);

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
    <Page title={'Select Support'}>
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
        websites={websitesData.status === 'Loaded' ? websitesData.data : []}
        authors={authorsData.status === 'Loaded' ? authorsData.data : []}
        websiteFilters={websiteFilters}
        setWebsiteFilters={setWebsiteFilters}
        authorFilters={authorFilters}
        setAuthorFilters={setAuthorFilters}
      />
    </Page>
  );
};

export default ScriptSelectionPage;
