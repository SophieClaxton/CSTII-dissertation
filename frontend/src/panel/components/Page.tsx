import ArrowBack from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import { PropsWithChildren } from 'react';
import { useNavigationContext } from '../contexts/contextHooks';
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box/Box';

interface PageProps {
  title: string;
  noBackButton?: true;
  onBack?: () => void;
}

const Page: React.FC<PageProps & PropsWithChildren> = ({
  title,
  noBackButton,
  onBack,
  children,
}) => {
  const { goBack } = useNavigationContext();

  return (
    <Stack alignItems={'center'} width={'100%'} height={'100%'}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '6rem 1fr 6rem',
          alignItems: 'center',
          width: '100%',
          padding: '0.5rem',
          backgroundColor: 'grey.200',
        }}
      >
        {!noBackButton && (
          <Button
            onClick={() => {
              (onBack ?? (() => undefined))();
              goBack();
            }}
            variant={'outlined'}
            sx={{ gridColumnStart: 1, justifySelf: 'start' }}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        )}
        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ gridColumnStart: 2, justifySelf: 'center' }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Stack>
  );
};

export default Page;
