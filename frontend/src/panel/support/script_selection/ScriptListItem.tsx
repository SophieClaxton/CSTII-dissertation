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
    <button
      className="script-item"
      key={script.id}
      onClick={() => {
        addParam(script.id);
        addScreen(ScreenType.ScriptSupport);
      }}
    >
      <h3 className="script-title">{script.title}</h3>
      <div className="script-author-and-date">
        <p className="script-author">{script.author.name}</p>
        <p className="script-created_at">{dateString}</p>
      </div>
      <p className="script-description">{script.description}</p>
    </button>
  );
};

export default ScriptListItem;
