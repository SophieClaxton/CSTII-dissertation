import axios from 'axios';
import APIResponse from '../models/api/APIResponse';
import { handleError } from '../models/api/APIError';
import User, {
  PublicUserWithWorkflows,
  UserWithWorkflows,
} from '../models/api/User';

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

const createUser = async (username: string): Promise<APIResponse<User>> => {
  try {
    const response = await usersEndpoint.post('', { name: username });
    return {
      status: 'Loaded',
      data: response.data as User,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getUser = async (
  userId: number,
): Promise<APIResponse<UserWithWorkflows>> => {
  try {
    const response = await usersEndpoint.get(`${userId}`);
    return {
      status: 'Loaded',
      data: response.data as UserWithWorkflows,
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
): Promise<APIResponse<PublicUserWithWorkflows>> => {
  console.log('Making request for public user');
  try {
    const response = await usersEndpoint.get(`public/${userId}`);
    return {
      status: 'Loaded',
      data: response.data as PublicUserWithWorkflows,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

export { getUsers, createUser, getUser, getPublicUser };
