import {
  Card,
  CardActionArea,
  CardContent,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigationContext } from '../../contexts/contextHooks';
import { ScreenType } from '../../models/ScreenType';
import { ScriptWithAuthorAndWebsite } from '../../models/Script';
import './styles/scriptListItem.css';

const ScriptListItem: React.FC<{ script: ScriptWithAuthorAndWebsite }> = ({
  script,
}) => {
  const dateString = script.created_at.toString();
  const { addScreen, addParam } = useNavigationContext();

  return (
    <ListItem key={script.id}>
      <Card className="script-card">
        <CardActionArea
          onClick={() => {
            addParam(script.id);
            addScreen(ScreenType.ScriptSupport);
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {script.title}
            </Typography>
            <Stack>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="subtitle1">
                  {script.author.name}
                </Typography>
                <Typography variant="subtitle1">{dateString}</Typography>
              </Stack>
              <Typography variant="body1">{script.description}</Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </ListItem>
    // <ListItemButton
    //   key={script.id}
    //   className="script-item"
    //   onClick={() => {
    //     addParam(script.id);
    //     addScreen(ScreenType.ScriptSupport);
    //   }}
    // >
    //   <ListItemText
    //     primary={script.title}
    //     secondary={
    //       <div>
    //         <div className="script-author-and-date">
    //           <p className="script-author">{script.author.name}</p>
    //           <p className="script-created_at">{dateString}</p>
    //         </div>
    //         <p className="script-description">{script.description}</p>
    //       </div>
    //     }
    //   />
    // </ListItemButton>
    // <button
    //   className="script-item"
    //   key={script.id}
    //   onClick={() => {
    //     addParam(script.id);
    //     addScreen(ScreenType.ScriptSupport);
    //   }}
    // >
    //   <h3 className="script-title">{script.title}</h3>
    //   <div className="script-author-and-date">
    //     <p className="script-author">{script.author.name}</p>
    //     <p className="script-created_at">{dateString}</p>
    //   </div>
    //   <p className="script-description">{script.description}</p>
    // </button>
  );
};

export default ScriptListItem;
