import ListItem from '@mui/material/ListItem/ListItem';
import { useNavigationContext } from '../../contexts/contextHooks';
import {
  ScriptWithAuthor,
  ScriptWithAuthorAndWebsite,
  ScriptWithWebsite,
} from '../../models/api_temp/Script';
import Card from '@mui/material/Card/Card';
import CardActionArea from '@mui/material/CardActionArea/CardActionArea';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import CardActions from '@mui/material/CardActions/CardActions';
import {
  scriptSupportScreen,
  userScriptSelectorScreen,
  websiteScriptSelectorScreen,
} from '../../navigation/screens';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';

const ScriptListItem: React.FC<{
  script: ScriptWithAuthorAndWebsite | ScriptWithAuthor | ScriptWithWebsite;
}> = ({ script }) => {
  const createdAtDate = new Date(script.created_at);
  const dateString = createdAtDate.toLocaleDateString();
  const { goTo } = useNavigationContext();

  return (
    <ListItem key={script.id} sx={{ padding: '0 0 0.5rem 0' }}>
      <Card sx={{ width: '100%' }} elevation={2}>
        <CardActionArea
          onClick={() => {
            goTo(scriptSupportScreen(script.id));
          }}
        >
          <CardContent sx={{ padding: '0.5rem' }}>
            <Typography variant="h5">{script.title}</Typography>
            <Typography variant="body1">{script.description}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {'author' in script && (
            <ButtonBase
              sx={{
                color: 'primary.main',
              }}
              onClick={() => {
                goTo(userScriptSelectorScreen(script.author.id));
              }}
            >
              <Typography variant="subtitle1">{script.author.name}</Typography>
            </ButtonBase>
          )}
          {'website' in script && (
            <ButtonBase
              sx={{
                color: 'primary.main',
              }}
              onClick={() => {
                goTo(websiteScriptSelectorScreen(script.website.id));
              }}
            >
              <Typography variant="subtitle1">{script.website.url}</Typography>
            </ButtonBase>
          )}
          <Typography variant="subtitle1">{dateString}</Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
};

export default ScriptListItem;
