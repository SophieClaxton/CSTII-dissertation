import axios from 'axios';
import APIResponse from '../models/api/APIResponse';
import {
  UnpublishedTaskWorkflow,
  UnpublishedTaskWorkflowBase,
  UpdateUnpublishedTaskWorkflowRequest,
} from '../models/api/UnpublishedTaskWorkflow';
import { handleError } from '../models/api/APIError';
import APISuccess from '../models/api/APISuccess';

const unpublishedTaskWorkflowsEndpoint = axios.create({
  baseURL: 'http://localhost:8000/unpublished_task_workflows/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

const createUnpublishedTaskWorkflow = async (
  userId: number,
): Promise<APIResponse<UnpublishedTaskWorkflowBase>> => {
  try {
    console.log('Making request for workflows');
    const response = await unpublishedTaskWorkflowsEndpoint.post(
      `user/${userId}`,
    );
    return {
      status: 'Loaded',
      data: response.data as UnpublishedTaskWorkflowBase,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getUnpublishedTaskWorkflow = async (
  workflowId: number,
): Promise<APIResponse<UnpublishedTaskWorkflow>> => {
  try {
    console.log('Making request for workflows');
    const response = await unpublishedTaskWorkflowsEndpoint.get(
      `${workflowId}`,
    );
    return {
      status: 'Loaded',
      data: response.data as UnpublishedTaskWorkflow,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const updateUnpublishedTaskWorkflow = async (
  workflowId: number,
  updates: UpdateUnpublishedTaskWorkflowRequest,
): Promise<APIResponse<UnpublishedTaskWorkflow>> => {
  try {
    console.log('Making request for workflows');
    const response = await unpublishedTaskWorkflowsEndpoint.patch(
      `${workflowId}`,
      updates,
    );
    return {
      status: 'Loaded',
      data: response.data as UnpublishedTaskWorkflow,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const deleteUnpublishedTaskWorkflow = async (
  workflowId: number,
): Promise<APIResponse<APISuccess>> => {
  try {
    console.log('Making request to delete workflow');
    const response = await unpublishedTaskWorkflowsEndpoint.delete(
      `${workflowId}`,
    );
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

export {
  createUnpublishedTaskWorkflow,
  getUnpublishedTaskWorkflow,
  updateUnpublishedTaskWorkflow,
  deleteUnpublishedTaskWorkflow,
};
