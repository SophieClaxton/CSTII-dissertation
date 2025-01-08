import axios from 'axios';
import APIResponse from '../models/APIResponse';
import { handleError } from '../models/APIError';
import User, { PublicUserWithScripts } from '../models/User';

const usersEndpoint = axios.create({
  baseURL: 'http://localhost:8000/users/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

const getUsers = async (): Promise<APIResponse<User[]>> => {
  try {
    const response = await usersEndpoint.get('');
    return {
      status: 'Loaded',
      data: response.data as User[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getPublicUser = async (
  userId: number,
): Promise<APIResponse<PublicUserWithScripts>> => {
  try {
    const response = await usersEndpoint.get(`public/${userId}`);
    return {
      status: 'Loaded',
      data: response.data as PublicUserWithScripts,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

export { getUsers, getPublicUser };
