import axios from 'axios';
import { handleError } from '../models/api/APIError';
import {
  BaseTaskWorkflow,
  PublishTaskWorkflowRequest,
  TaskWorkflow,
  TaskWorkflowWithAuthorAndWebsite,
  UpdateTaskWorkflowRequest,
} from '../models/api/TaskWorkflow';
import APISuccess from '../models/api/APISuccess';
import APIResponse from '../models/api/APIResponse';
import { CreateAnnotationRequest } from '../models/api/Annotation';

const taskWorkflowsEndpoint = axios.create({
  baseURL: 'http://localhost:8000/task_workflows/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

const getTaskWorkflows = async (): Promise<
  APIResponse<TaskWorkflowWithAuthorAndWebsite[]>
> => {
  try {
    console.log('Making request for workflows');
    const response = await taskWorkflowsEndpoint.get('');
    return {
      status: 'Loaded',
      data: response.data as TaskWorkflowWithAuthorAndWebsite[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getTaskWorkflow = async (
  id: number,
): Promise<APIResponse<TaskWorkflow>> => {
  console.log('Making request for task workflow');
  try {
    const response = await taskWorkflowsEndpoint.get(`${id}`);
    return {
      status: 'Loaded',
      data: response.data as TaskWorkflow,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const publishTaskWorkflow = async (
  workflow: PublishTaskWorkflowRequest,
): Promise<APIResponse<BaseTaskWorkflow>> => {
  try {
    const response = await taskWorkflowsEndpoint.post('', workflow);
    return {
      status: 'Loaded',
      data: response.data as BaseTaskWorkflow,
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const updateTaskWorkflow = async (
  workflowId: number,
  workflow: UpdateTaskWorkflowRequest,
): Promise<APIResponse<APISuccess>> => {
  console.log('Making request for workflow update');
  try {
    const response = await taskWorkflowsEndpoint.patch(
      `${workflowId}`,
      workflow,
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

const deleteTaskWorkflow = async (
  id: number,
): Promise<APIResponse<APISuccess>> => {
  try {
    const response = await taskWorkflowsEndpoint.delete(`${id}`);
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

const annotateTaskWorkflow = async (
  workflowId: number,
  annotationRequest: CreateAnnotationRequest,
): Promise<APIResponse<APISuccess>> => {
  console.log('Making request to annotate workflows');
  try {
    const response = await taskWorkflowsEndpoint.post(
      `${workflowId}/annotate`,
      annotationRequest,
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

const getUserTaskWorkflows = async (
  userId: number,
): Promise<APIResponse<TaskWorkflowWithAuthorAndWebsite[]>> => {
  console.log('Making request for workflows');
  try {
    const response = await taskWorkflowsEndpoint.get(`user/${userId}`);
    return {
      status: 'Loaded',
      data: response.data as TaskWorkflowWithAuthorAndWebsite[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

const getWebsiteTaskWorkflows = async (
  websiteId: number,
): Promise<APIResponse<TaskWorkflowWithAuthorAndWebsite[]>> => {
  console.log('Making request for workflows');
  try {
    const response = await taskWorkflowsEndpoint.get(`website/${websiteId}`);
    return {
      status: 'Loaded',
      data: response.data as TaskWorkflowWithAuthorAndWebsite[],
    };
  } catch (err: unknown) {
    return {
      status: 'Error',
      error: handleError(err),
    };
  }
};

export {
  getTaskWorkflows,
  getTaskWorkflow,
  publishTaskWorkflow,
  updateTaskWorkflow,
  deleteTaskWorkflow,
  annotateTaskWorkflow,
  getUserTaskWorkflows,
  getWebsiteTaskWorkflows,
};
