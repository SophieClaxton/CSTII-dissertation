import Alert from '@mui/material/Alert/Alert';

interface AnnotationMessageDetails {
  id: string;
  description: string;
}

const AnnotationMessage: React.FC<AnnotationMessageDetails> = ({
  id,
  description,
}) => {
  return (
    <Alert id={`annot-${id}`} icon={false} variant="outlined" severity="info">
      {description}
    </Alert>
  );
};

export default AnnotationMessage;
export type { AnnotationMessageDetails };
