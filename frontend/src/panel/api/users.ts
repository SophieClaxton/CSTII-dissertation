import axios from 'axios';
import APIResponse from '../models/API/APIResponse';
import { handleError } from '../models/API/APIError';
import User, { PublicUserWithScripts, UserWithScripts } from '../models/API/User';

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
): Promise<APIResponse<UserWithScripts>> => {
  try {
    const response = await usersEndpoint.get(`${userId}`);
    return {
      status: 'Loaded',
      data: response.data as UserWithScripts,
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

export { getUsers, createUser, getUser, getPublicUser };
