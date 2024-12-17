import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getProjectScope = createAsyncThunk('getProjectScope', async (object, { rejectWithValue }) => {
  const { projectId, pageIndex, pageSize, listType, sortBy = 'updatedAt', sortOrder = 'DESC', getAll } = object || {};

  const response = await request('/project-scope', {
    method: 'GET',
    query: {
      projectId,
      listType,
      ...(!getAll && { sort: [sortBy, sortOrder] }),
      ...(!getAll && { pageIndex }),
      ...(!getAll && { pageSize })
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeHistory = createAsyncThunk('getProjectScopeHistory', async (object, { rejectWithValue }) => {
  const { projectScopeId, pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', recordId } = object || {};
  const response = await request('/project-scope-history', {
    method: 'GET',
    query: { projectScopeId, sort: [sortBy, sortOrder], pageIndex, pageSize },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeExtension = createAsyncThunk('getProjectScopeExtension', async (object, { rejectWithValue }) => {
  const { projectScopeId, pageIndex, pageSize, listType, sortBy = 'updatedAt', sortOrder = 'DESC', getAll } = object || {};

  const response = await request('/project-scope-extension', {
    method: 'GET',
    query: {
      projectScopeId,
      listType,
      ...(!getAll && { sort: [sortBy, sortOrder] }),
      ...(!getAll && { pageIndex }),
      ...(!getAll && { pageSize })
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeExtensionHistory = createAsyncThunk('getProjectScopeExtensionHistory', async (object, { rejectWithValue }) => {
  const { projectScopeExtensionId, pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', recordId } = object || {};
  const response = await request('/project-scope-extension-history', {
    method: 'GET',
    query: { projectScopeExtensionId, sort: [sortBy, sortOrder], pageIndex, pageSize },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeSat = createAsyncThunk('getProjectScopeSat', async (object, { rejectWithValue }) => {
  const { projectScopeId, pageIndex, pageSize, listType, sortBy = 'updatedAt', sortOrder = 'DESC', getAll } = object || {};

  const response = await request('/project-scope-sat', {
    method: 'GET',
    query: {
      projectScopeId,
      listType,
      ...(!getAll && { sort: [sortBy, sortOrder] }),
      ...(!getAll && { pageIndex }),
      ...(!getAll && { pageSize })
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeSatHistory = createAsyncThunk('getProjectScopeSatHistory', async (object, { rejectWithValue }) => {
  const { projectScopeSatId, pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', recordId } = object || {};
  const response = await request('/project-scope-sat-history', {
    method: 'GET',
    query: { projectScopeSatId, sort: [sortBy, sortOrder], pageIndex, pageSize },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

// ---------------------------------------------------------------------

export const getProjectAllScope = createAsyncThunk('getProjectAllScope', async (object, { rejectWithValue }) => {
  const { projectId, pageIndex, pageSize, listType, sortBy = 'updatedAt', sortOrder = 'DESC', getAll } = object || {};

  const response = await request('/project-scope', {
    method: 'GET',
    query: {
      projectId,
      listType,
      ...(!getAll && { sort: [sortBy, sortOrder] }),
      ...(!getAll && { pageIndex }),
      ...(!getAll && { pageSize })
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeAllHistory = createAsyncThunk('getProjectScopeAllHistory', async (object, { rejectWithValue }) => {
  const { projectScopeId, sortBy = 'updatedAt', sortOrder = 'DESC', recordId } = object || {};
  const response = await request('/project-scope-history', {
    method: 'GET',
    query: { projectScopeId, sort: [sortBy, sortOrder] },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeAllExtension = createAsyncThunk('getProjectScopeAllExtension', async (object, { rejectWithValue }) => {
  const { projectScopeId, listType, sortBy = 'updatedAt', sortOrder = 'DESC', getAll } = object || {};

  const response = await request('/project-scope-extension', {
    method: 'GET',
    query: {
      projectScopeId,
      listType,
      ...(!getAll && { sort: [sortBy, sortOrder] })
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeExtensionAllHistory = createAsyncThunk(
  'getProjectScopeExtensionAllHistory',
  async (object, { rejectWithValue }) => {
    const { projectScopeExtensionId, sortBy = 'updatedAt', sortOrder = 'DESC', recordId } = object || {};
    const response = await request('/project-scope-extension-history', {
      method: 'GET',
      query: { projectScopeExtensionId, sort: [sortBy, sortOrder] },
      params: recordId
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getProjectScopeAllSat = createAsyncThunk('getProjectScopeAllSat', async (object, { rejectWithValue }) => {
  const { projectScopeId, listType, sortBy = 'updatedAt', sortOrder = 'DESC', getAll } = object || {};

  const response = await request('/project-scope-sat', {
    method: 'GET',
    query: {
      projectScopeId,
      listType,
      ...(!getAll && { sort: [sortBy, sortOrder] })
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectScopeSatAllHistory = createAsyncThunk('getProjectScopeSatAllHistory', async (object, { rejectWithValue }) => {
  const { projectScopeSatId, sortBy = 'updatedAt', sortOrder = 'DESC', recordId } = object || {};
  const response = await request('/project-scope-sat-history', {
    method: 'GET',
    query: { projectScopeSatId, sort: [sortBy, sortOrder] },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
