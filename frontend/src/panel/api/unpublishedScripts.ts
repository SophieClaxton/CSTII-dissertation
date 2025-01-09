import axios from 'axios';
import APIResponse from '../models/APIResponse';
import {
  UnpublishedScript,
  UnpublishedScriptBase,
} from '../models/UnpublishedScript';
import { handleError } from '../models/APIError';

const unpublishedScriptsEndpoint = axios.create({
  baseURL: 'http://localhost:8000/unpublished_scripts/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

const createUnpublishedScript = async (
  userId: number,
): Promise<APIResponse<UnpublishedScriptBase>> => {
  try {
    console.log('Making request for scripts');
    const response = await unpublishedScriptsEndpoint.post(`user/${userId}`);
    return {
      status: 'Loaded',
      data: response.data as UnpublishedScriptBase,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getUnpublishedScript = async (
  scriptId: number,
): Promise<APIResponse<UnpublishedScript>> => {
  try {
    console.log('Making request for scripts');
    const response = await unpublishedScriptsEndpoint.get(`${scriptId}`);
    return {
      status: 'Loaded',
      data: response.data as UnpublishedScript,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

export { createUnpublishedScript, getUnpublishedScript };
