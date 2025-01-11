import Stack from '@mui/material/Stack/Stack';
import InterfaceElement from '../../models/InterfaceElement';
import IconButton from '@mui/material/IconButton/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';

interface ElementSelectorProps {
  element: InterfaceElement | undefined;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({ element }) => {
  const onAddElement = () => console.log('Add element');
  const onDeleteElement = () => console.log('Delete element');

  const text = element ? element.tag : 'Add element';
  const action = element ? onDeleteElement : onAddElement;
  const icon = element ? <Delete /> : <Add />;

  return (
    <Stack direction={'row'} spacing={1}>
      <p>{text}</p>
      <IconButton onClick={action}>{icon}</IconButton>
    </Stack>
  );
};

export default ElementSelector;
