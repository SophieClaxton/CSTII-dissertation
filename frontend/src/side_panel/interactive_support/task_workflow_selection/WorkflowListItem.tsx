import ListItem from '@mui/material/ListItem/ListItem';
import { useNavigationContext } from '../../contexts/contextHooks';
import {
  TaskWorkflowWithAuthor,
  TaskWorkflowWithAuthorAndWebsite,
  TaskWorkflowWithWebsite,
} from '../../models/api/TaskWorkflow';
import Card from '@mui/material/Card/Card';
import CardActionArea from '@mui/material/CardActionArea/CardActionArea';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import CardActions from '@mui/material/CardActions/CardActions';
import {
  workflowSupportScreen,
  userWorkflowSelectorScreen,
  websiteWorkflowSelectorScreen,
} from '../../navigation/screens';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';

const WorkflowListItem: React.FC<{
  workflow:
    | TaskWorkflowWithAuthorAndWebsite
    | TaskWorkflowWithAuthor
    | TaskWorkflowWithWebsite;
}> = ({ workflow }) => {
  const createdAtDate = new Date(workflow.created_at);
  const dateString = createdAtDate.toLocaleDateString();
  const { goTo } = useNavigationContext();

  return (
    <ListItem key={workflow.id} sx={{ padding: '0 0 0.5rem 0' }}>
      <Card sx={{ width: '100%' }} elevation={2}>
        <CardActionArea
          onClick={() => {
            goTo(workflowSupportScreen(workflow.id));
          }}
        >
          <CardContent sx={{ padding: '0.5rem' }}>
            <Typography variant="h5">{workflow.title}</Typography>
            <Typography variant="body1">{workflow.description}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {'author' in workflow && (
            <ButtonBase
              sx={{
                color: 'primary.main',
              }}
              onClick={() => {
                goTo(userWorkflowSelectorScreen(workflow.author.id));
              }}
            >
              <Typography variant="subtitle1">
                {workflow.author.name}
              </Typography>
            </ButtonBase>
          )}
          {'website' in workflow && (
            <ButtonBase
              sx={{
                color: 'primary.main',
              }}
              onClick={() => {
                goTo(websiteWorkflowSelectorScreen(workflow.website.id));
              }}
            >
              <Typography variant="subtitle1">
                {workflow.website.url}
              </Typography>
            </ButtonBase>
          )}
          <Typography variant="subtitle1">{dateString}</Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
};

export default WorkflowListItem;
