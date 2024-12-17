import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getFormData = createAsyncThunk('getFormData', async (object, { rejectWithValue }) => {
  const { projectId, typeId, sortBy, sortOrder } = object || {};
  const response = await request('/form-list', {
    method: 'GET',
    query: { projectId, formTypeId: typeId, sort: [sortBy, sortOrder] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormDataCustom = createAsyncThunk('getFormDataCustom', async (object, { rejectWithValue }) => {
  const { projectId, formTypeId } = object || {};
  const response = await request('/get-form-list-custom', {
    method: 'GET',
    query: { projectId, formTypeId }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropDownLov = createAsyncThunk('getDropDownLov', async (object, { rejectWithValue }) => {
  const { dropdownPayload, apiVersion: apiVersionNumber, refetched } = object || {};
  const response = await request('/form/get-dropdown-field-data', {
    method: 'POST',
    body: dropdownPayload,
    ...(apiVersionNumber && { apiVersionNumber })
  });
  if (response.success) {
    return { ...response.data, refetched };
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getWebformData = createAsyncThunk('getWebformData', async (object, { rejectWithValue }) => {
  const { projectId, typeId, sortBy, sortOrder, accessSource } = object || {};
  const response = await request('/form-list', {
    method: 'GET',
    query: { projectId, formTypeId: typeId, sort: [sortBy, sortOrder], accessSource }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormDetail = createAsyncThunk('getFormDetail', async (object, { rejectWithValue }) => {
  const response = await request('/form-details', {
    method: 'GET',
    params: object
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDefaultFormAttributes = createAsyncThunk('getDefaultFormAttributes', async (object, { rejectWithValue }) => {
  const response = await request('/default-attributes-list', { method: 'GET', query: { sort: ['rank', 'ASC'] } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormAttributes = createAsyncThunk('getFormAttributes', async (object, { rejectWithValue }) => {
  const { sortBy, sortOrder, formId, listType } = object || {};
  const response = await request('/form-attributes-list', { method: 'GET', query: { formId, sort: [sortBy, sortOrder], listType } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormValidationBlock = createAsyncThunk('getFormValidationBlock', async (object, { rejectWithValue }) => {
  const response = await request('/attribute-validation-block-list', {
    method: 'GET',
    query: { formId: object, sort: ['updatedAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormVisibilityBlock = createAsyncThunk('getFormVisibilityBlock', async (object, { rejectWithValue }) => {
  const response = await request('/attribute-visibility-block-list', {
    method: 'GET',
    query: { formId: object, sort: ['updatedAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormIntegrationBlock = createAsyncThunk('getFormIntegrationBlock', async (object, { rejectWithValue }) => {
  const response = await request('/attribute-integration-block-list', {
    method: 'GET',
    query: { formId: object, sort: ['updatedAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormAttributeIntegrationCondition = createAsyncThunk(
  'getFormAttributeIntegrationCondition',
  async (object, { rejectWithValue }) => {
    const response = await request('/attribute-integration-condition-by-integrationBLock-id-list', {
      method: 'GET',
      params: object
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getFormIntegrationBlockById = createAsyncThunk('getFormIntegrationBlockById', async (object, { rejectWithValue }) => {
  const response = await request('/attribute-integration-block-details', {
    method: 'GET',
    params: object
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormAttributeIntegrationPayload = createAsyncThunk(
  'getFormAttributeIntegrationPayload',
  async (object, { rejectWithValue }) => {
    const response = await request('/attribute-integration-payload-by-integrationBlock-id-list', {
      method: 'GET',
      params: object,
      query: { sort: ['createdAt', 'ASC'] }
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getFormAttributeValidationCondition = createAsyncThunk(
  'getFormAttributeValidationCondition',
  async (object, { rejectWithValue }) => {
    const response = await request('/attribute-validation-condition-by-validtionBLock-id-list', {
      method: 'GET',
      params: object
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getFormAttributeVisibilityCondition = createAsyncThunk(
  'getFormAttributeVisibilityCondition',
  async (object, { rejectWithValue }) => {
    const response = await request('/attribute-visibility-condition-by-visibilityBLock-id-list', {
      method: 'GET',
      params: object
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getAllMastersList = createAsyncThunk('getAllMastersList', async (object, { rejectWithValue }) => {
  const response = await request('/all-masters-list', {
    method: 'GET'
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getAllMasters = createAsyncThunk('getAllMasters', async (object, { rejectWithValue }) => {
  const { sortBy, sortOrder, userId } = object;
  const response = await request('/get-masters', {
    method: 'GET',
    params: userId,
    query: { sort: [sortBy, sortOrder] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getLov = createAsyncThunk('getLov', async (object, { rejectWithValue }) => {
  const { sortBy, sortOrder, params } = object;
  const response = await request(
    '/get-lovs',
    {
      method: 'GET',
      params: params,
      query: { sort: [sortBy, sortOrder] }
    },
    false
  );
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getRightsFor = createAsyncThunk('getRightsFor', async (object, { rejectWithValue }) => {
  // const { sortBy, sortOrder } = object;
  const response = await request(
    '/all-masters-list-rights-for',
    {
      method: 'GET'
      // query: { sort: [sortBy, sortOrder] }
    },
    false
  );
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getAllMastersColumnList = createAsyncThunk('getAllMastersColumnList', async (object, { rejectWithValue }) => {
  const response = await request('/all-master-columns-list', {
    method: 'GET',
    params: object
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownPayloadParent = createAsyncThunk('getDropdownPayloadParent', async (object, { rejectWithValue }) => {
  const response = await request('/attribute-integration-payload-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
