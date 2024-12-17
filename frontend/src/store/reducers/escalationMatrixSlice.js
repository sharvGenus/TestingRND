import { createSlice } from '@reduxjs/toolkit';
import { getEscalationMatrix } from 'store/actions';

export const escalationMatrix = createSlice({
  name: 'escalationMatrix',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEscalationMatrix.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getEscalationMatrix.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.escalationMatrixObject = payload.data;
      state.error = '';
    });
    builder.addCase(getEscalationMatrix.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
