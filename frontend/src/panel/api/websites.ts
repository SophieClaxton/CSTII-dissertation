import axios from 'axios';
import APIResponse from '../models/APIResponse';
import Website, { WebsiteWithScripts } from '../models/Website';
import { handleError } from '../models/APIError';

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

const getWebsite = async (
  websiteId: number,
): Promise<APIResponse<WebsiteWithScripts>> => {
  try {
    const response = await websitesEndpoint.get(`${websiteId}`);
    return {
      status: 'Loaded',
      data: response.data as WebsiteWithScripts,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

export { getWebsites, getWebsite };
