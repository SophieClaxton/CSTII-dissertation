import SyntaxErrorMessage, {
  SyntaxErrorMessageDetails,
} from '../../../syntax_checker/SyntaxErrorMessage';
import AnnotationMessage, {
  AnnotationMessageDetails,
} from '../AnnotationMessage';
import Box from '@mui/material/Box/Box';
import './sideDetail.css';

interface SideDetailsProps {
  showErrors: boolean;
  showAnnotations: boolean;
  syntaxError?: SyntaxErrorMessageDetails;
  annotation?: AnnotationMessageDetails;
}

const SideDetails: React.FC<SideDetailsProps> = ({
  showAnnotations,
  showErrors,
  syntaxError,
  annotation,
}) => {
  return (
    <>
      {((showAnnotations && annotation) || (showErrors && syntaxError)) && (
        <Box className="side-detail">
          {showAnnotations && annotation && (
            <AnnotationMessage {...annotation} />
          )}
          {showErrors && syntaxError && <SyntaxErrorMessage {...syntaxError} />}
        </Box>
      )}
    </>
  );
};

export default SideDetails;
