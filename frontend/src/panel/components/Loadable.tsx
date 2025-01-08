import { ReactNode } from 'react';
import APIResponse from '../models/APIResponse';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import Alert from '@mui/material/Alert/Alert';
import AlertTitle from '@mui/material/AlertTitle/AlertTitle';

interface LoadableProps<D> {
  response: APIResponse<D>;
  onLoad: (data: D) => ReactNode;
}

const Loadable = <D,>({ response, onLoad }: LoadableProps<D>) => {
  switch (response.status) {
    case 'Loading':
      return <CircularProgress />;
    case 'Error':
      return (
        <Alert severity="error">
          <AlertTitle>Something went wrong.</AlertTitle>
          {response.error.message}
        </Alert>
      );
    case 'Loaded':
      return onLoad(response.data);
  }
};

export default Loadable;
