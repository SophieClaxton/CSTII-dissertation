import ListItem from '@mui/material/ListItem/ListItem';
import { useNavigationContext } from '../../contexts/contextHooks';
import Card from '@mui/material/Card/Card';
import CardActionArea from '@mui/material/CardActionArea/CardActionArea';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import CardActions from '@mui/material/CardActions/CardActions';
import { editorScreen } from '../../navigation/screens';
import { UnpublishedScriptWithWebsite } from '../../models/api_temp/UnpublishedScript';

const UnpublishedScriptListItem: React.FC<{
  script: UnpublishedScriptWithWebsite;
}> = ({ script }) => {
  const createdAtDate = new Date(script.created_at);
  const dateString = createdAtDate.toLocaleDateString();
  const { goTo } = useNavigationContext();

  return (
    <ListItem key={script.id} sx={{ padding: '0 0 0.5rem 0' }}>
      <Card sx={{ width: '100%' }} elevation={2}>
        <CardActionArea
          onClick={() => {
            goTo(editorScreen(script.id));
          }}
        >
          <CardContent sx={{ padding: '0.5rem' }}>
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
            <Typography variant="subtitle1">{script.website.url}</Typography>
          )}
          <Typography variant="subtitle1">{dateString}</Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
};

export default UnpublishedScriptListItem;
