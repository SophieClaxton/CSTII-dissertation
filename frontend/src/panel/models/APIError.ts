import { AxiosError } from 'axios';

interface APIError {
  type: 'Response' | 'Request' | 'Unknown';
  message: string;
}

const handleError = (err: unknown): APIError => {
  if (err instanceof AxiosError) {
    if (err.response) {
      return {
        type: 'Response',
        message: `${err.status} : ${err.message}`,
      };
    }
    if (err.request) {
      return {
        type: 'Request',
        message: `${err.message}`,
      };
    }
    return {
      type: 'Unknown',
      message: `Could not make request`,
    };
  }
  return {
    type: 'Unknown',
    message: 'Unrelated to making request',
  };
};

export default APIError;
export { handleError };
