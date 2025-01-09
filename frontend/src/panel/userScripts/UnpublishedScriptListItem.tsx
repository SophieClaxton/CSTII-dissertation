import ListItem from '@mui/material/ListItem/ListItem';
import { useNavigationContext } from '../contexts/contextHooks';
import '../support/script_selection/styles/scriptListItem.css';
import Card from '@mui/material/Card/Card';
import CardActionArea from '@mui/material/CardActionArea/CardActionArea';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import CardActions from '@mui/material/CardActions/CardActions';
import { scriptSupportScreen } from '../navigation/screens';
import { UnpublishedScriptWithWebsite } from '../models/UnpublishedScript';

const UnpublishedScriptListItem: React.FC<{
  script: UnpublishedScriptWithWebsite;
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
            {script.description && (
              <Typography variant="body1">{script.description}</Typography>
            )}
          </CardContent>
        </CardActionArea>
        <CardActions>
          {script.website && (
            <Button variant="text" onClick={() => {}}>
              <Typography variant="subtitle1">{script.website.url}</Typography>
            </Button>
          )}
          <Typography variant="subtitle1">{dateString}</Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
};

export default UnpublishedScriptListItem;
