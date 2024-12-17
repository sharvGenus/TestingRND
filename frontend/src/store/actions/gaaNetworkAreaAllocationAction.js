import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getGaaNetworkAreaAllocation = createAsyncThunk('getGaaNetworkAreaAllocation', async (object, { rejectWithValue }) => {
  const { selectedOrganizationType, selectedOrganizationNameOuter, setIsLoading } = object || {};
  const response = await request('/user-gaa-network', {
    method: 'GET',
    query: { orgType: selectedOrganizationType, orgId: selectedOrganizationNameOuter }
  });
  if (response.success) {
    setIsLoading(false);
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  setIsLoading(false);
  throw rejectWithValue(error || 'Something went wrong');
});
