import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getDailyExecutionPlan = createAsyncThunk('getDailyExecutionPlan', async (object, { rejectWithValue }) => {
  const { projectId, materialTypeId, month, year, listType } = object || {};

  const response = await request('/daily-execution-plan', {
    method: 'GET',
    query: {
      projectId,
      materialTypeId,
      month,
      year,
      listType
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getAllDailyExecutionPlan = createAsyncThunk('getAllDailyExecutionPlan', async (object, { rejectWithValue }) => {
  const { projectId, materialTypeId, listType } = object || {};

  const response = await request('/daily-execution-plan', {
    method: 'GET',
    query: {
      projectId,
      materialTypeId,
      listType
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDailyExecutionPlanHistory = createAsyncThunk('getDailyExecutionPlanHistory', async (object, { rejectWithValue }) => {
  const { recordId } = object || {};
  const response = await request('/daily-execution-plan-history', {
    method: 'GET',
    query: { sort: ['updatedAt', 'DESC'] },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
