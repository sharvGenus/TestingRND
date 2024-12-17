import { createSlice } from '@reduxjs/toolkit';
import { getEmailTemplates } from 'store/actions';

export const emailTemplatesList = createSlice({
  name: 'emailTemplatesList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEmailTemplates.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getEmailTemplates.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.templateObject = payload.data;
      state.error = '';
    });
    builder.addCase(getEmailTemplates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
