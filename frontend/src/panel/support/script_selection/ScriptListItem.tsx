import ListItem from '@mui/material/ListItem/ListItem';
import { useNavigationContext } from '../../contexts/contextHooks';
import {
  ScriptWithAuthor,
  ScriptWithAuthorAndWebsite,
  ScriptWithWebsite,
} from '../../models/Script';
import './styles/scriptListItem.css';
import Card from '@mui/material/Card/Card';
import CardActionArea from '@mui/material/CardActionArea/CardActionArea';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import CardActions from '@mui/material/CardActions/CardActions';
import {
  scriptSupportScreen,
  userScriptSelectorScreen,
  websiteScriptSelectorScreen,
} from '../../navigation/screens';

const ScriptListItem: React.FC<{
  script: ScriptWithAuthorAndWebsite | ScriptWithAuthor | ScriptWithWebsite;
}> = ({ script }) => {
  const dateString = script.created_at.toString();
  const { goTo } = useNavigationContext();

  return (
    <ListItem key={script.id}>
      <Card className="script-card">
        <CardActionArea
          onClick={() => {
            goTo(scriptSupportScreen(script.id));
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {script.title}
            </Typography>
            <Typography variant="body1">{script.description}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {'author' in script && (
            <Button
              variant="text"
              onClick={() => {
                goTo(userScriptSelectorScreen(script.author.id));
              }}
            >
              <Typography variant="subtitle1">{script.author.name}</Typography>
            </Button>
          )}
          {'website' in script && (
            <Button
              variant="text"
              onClick={() => {
                goTo(websiteScriptSelectorScreen(script.website.id));
              }}
            >
              <Typography variant="subtitle1">{script.website.url}</Typography>
            </Button>
          )}
          <Typography variant="subtitle1">{dateString}</Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
};

export default ScriptListItem;
