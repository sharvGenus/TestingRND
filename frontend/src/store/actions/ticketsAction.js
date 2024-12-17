import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getTicketByProject = createAsyncThunk('getTicketsByProject', async (object, { rejectWithValue }) => {
  const { projectId, listType, aging, ticketStatus, pageIndex, pageSize, bySupervisorIdFlag, searchString, accessorsRef } = object || {};
  const response = await request(`/ticket-list`, {
    method: 'GET',
    query: {
      projectId,
      listType,
      aging,
      ticketStatus,
      pageIndex,
      pageSize,
      bySupervisorIdFlag,
      searchString: searchString?.trim() || '',
      headerColumns: accessorsRef?.current?.filter((key) => typeof key === 'string') || []
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTicketAgingCount = createAsyncThunk('getTicketAgingCount', async (object, { rejectWithValue }) => {
  const { projectId, ticketStatus } = object || {};
  const response = await request('/ticket-aging-count', { method: 'GET', query: { projectId, ticketStatus } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTicketHistory = createAsyncThunk('getTicketHistory', async (object, { rejectWithValue }) => {
  const { recordId, pageIndex, pageSize } = object || {};
  const response = await request('/ticket-history', { method: 'GET', params: recordId, query: { pageIndex, pageSize } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
