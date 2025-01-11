import { useEffect, useState } from 'react';
import { useNavigationContext } from '../../contexts/contextHooks';
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

const ScriptSelectionPage: React.FC = () => {
  const { goBack } = useNavigationContext();
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
    <div className="script-selection-page page">
      <div className="page-title">
        <h1>Select a Script</h1>
        <button className="back-button" onClick={goBack}>
          Back
        </button>
      </div>
      <div className="all-scripts-container">
        <Loadable
          response={scriptsData}
          onLoad={() => (
            <>
              <FilterBar
                setOpenFilterDialog={setOpenFilterDialog}
                websiteFilters={websiteFilters}
                setWebsiteFilters={setWebsiteFilters}
                authorFilters={authorFilters}
                setAuthorFilters={setAuthorFilters}
              />
              <List className="script-list">
                {scripts.map((script) => (
                  <ScriptListItem script={script} />
                ))}
              </List>
            </>
          )}
        ></Loadable>
      </div>
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
    </div>
  );
};

export default ScriptSelectionPage;
