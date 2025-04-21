import APIError from './APIError';

type APIResponse<D> = LoadingResponse | SuccesfulResponse<D> | ErrorResponse;

interface LoadingResponse {
  status: 'Loading';
}

interface SuccesfulResponse<D> {
  status: 'Loaded';
  data: D;
}

interface ErrorResponse {
  status: 'Error';
  error: APIError;
}

export default APIResponse;
export type { LoadingResponse, SuccesfulResponse, ErrorResponse };
