import axios from 'axios';
import APIResponse from '../models/api/APIResponse';
import Website, {
  WebsiteRequest,
  WebsiteWithWorkflows,
} from '../models/api/Website';
import { handleError } from '../models/api/APIError';

const websitesEndpoint = axios.create({
  baseURL: 'http://localhost:8000/websites/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

const getWebsites = async (): Promise<APIResponse<Website[]>> => {
  try {
    const response = await websitesEndpoint.get('');
    return {
      status: 'Loaded',
      data: response.data as Website[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const createWebsite = async (
  websiteRequest: WebsiteRequest,
): Promise<APIResponse<Website>> => {
  try {
    const response = await websitesEndpoint.post('', websiteRequest);
    return {
      status: 'Loaded',
      data: response.data as Website,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getWebsite = async (
  websiteId: number,
): Promise<APIResponse<WebsiteWithWorkflows>> => {
  console.log('Making request for website');
  try {
    const response = await websitesEndpoint.get(`${websiteId}`);
    return {
      status: 'Loaded',
      data: response.data as WebsiteWithWorkflows,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

export { getWebsites, createWebsite, getWebsite };
