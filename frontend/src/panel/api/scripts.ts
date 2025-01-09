import axios from 'axios';
import { handleError } from '../models/APIError';
import { Script, ScriptWithAuthorAndWebsite } from '../models/Script';
import APISuccess from '../models/APISuccess';
import APIResponse from '../models/APIResponse';

const scriptsEndpoint = axios.create({
  baseURL: 'http://localhost:8000/scripts/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

const getScripts = async (): Promise<
  APIResponse<ScriptWithAuthorAndWebsite[]>
> => {
  try {
    console.log('Making request for scripts');
    const response = await scriptsEndpoint.get('');
    return {
      status: 'Loaded',
      data: response.data as ScriptWithAuthorAndWebsite[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getScript = async (id: number): Promise<APIResponse<Script>> => {
  try {
    const response = await scriptsEndpoint.get(`${id}`);
    return {
      status: 'Loaded',
      data: response.data as Script,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const deleteScript = async (id: number): Promise<APIResponse<APISuccess>> => {
  try {
    const response = await scriptsEndpoint.delete(`${id}`);
    return {
      status: 'Loaded',
      data: response.data as APISuccess,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getUserScripts = async (
  userId: number,
): Promise<APIResponse<ScriptWithAuthorAndWebsite[]>> => {
  try {
    const response = await scriptsEndpoint.get(`user/${userId}`);
    return {
      status: 'Loaded',
      data: response.data as ScriptWithAuthorAndWebsite[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getWebsiteScripts = async (
  websiteId: number,
): Promise<APIResponse<ScriptWithAuthorAndWebsite[]>> => {
  try {
    const response = await scriptsEndpoint.get(`website/${websiteId}`);
    return {
      status: 'Loaded',
      data: response.data as ScriptWithAuthorAndWebsite[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

export {
  getScripts,
  getScript,
  deleteScript,
  getUserScripts,
  getWebsiteScripts,
};