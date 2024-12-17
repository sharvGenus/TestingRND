import { createSlice } from '@reduxjs/toolkit';
import {
  getDefaultFormAttributes,
  getFormAttributes,
  getFormDetail,
  getFormData,
  getFormValidationBlock,
  getFormVisibilityBlock,
  getFormIntegrationBlock,
  getFormAttributeIntegrationCondition,
  getFormAttributeValidationCondition,
  getFormAttributeVisibilityCondition,
  getAllMastersList,
  getAllMastersColumnList,
  getAllMasters,
  getLov,
  getRightsFor,
  getWebformData,
  getDropDownLov,
  getFormDataCustom,
  getFormAttributeIntegrationPayload,
  getDropdownPayloadParent,
  getFormIntegrationBlockById
} from 'store/actions';

export const formData = createSlice({
  name: 'formData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormData.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formDataObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const formDataCustom = createSlice({
  name: 'formDataCustom',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormDataCustom.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormDataCustom.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formDataCustom = payload;
      state.error = '';
    });
    builder.addCase(getFormDataCustom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const dropdownLovDataSlice = createSlice({
  name: 'dropdownLovData',
  initialState: {},
  reducers: {
    reset() {
      return {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDropDownLov.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropDownLov.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.refetched) {
        const oldState = JSON.parse(JSON.stringify(state));
        oldState.dropdownLovDataObject.forEach((item, index) => {
          const [key] = Object.keys(item);
          let i = 0;
          while (i < payload.dropdownData.length) {
            const newItem = payload.dropdownData[i];
            if (Object.hasOwn(newItem, key)) {
              oldState.dropdownLovDataObject.splice(index, 1, newItem);
            }
            i += 1;
          }
        });
        state.dropdownLovDataObject = oldState.dropdownLovDataObject;
      } else {
        state.dropdownLovDataObject = payload.dropdownData;
        state.sourceColumnByIdObject = payload.sourceColumnById;
        state.duplicatedValues = payload.duplicatedValues;
      }
      state.error = '';
    });
    builder.addCase(getDropDownLov.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const dropdownLovData = dropdownLovDataSlice.reducer;

export const webformData = createSlice({
  name: 'webformData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWebformData.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getWebformData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.webformDataObject = payload.data;
      state.error = '';
    });
    builder.addCase(getWebformData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const defaultFormAttributes = createSlice({
  name: 'defaultFormAttributes',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDefaultFormAttributes.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDefaultFormAttributes.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.defaultFormAttributesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDefaultFormAttributes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const formAttributesSlice = createSlice({
  name: 'formAttributes',
  initialState: {},
  reducers: {
    reset() {
      return {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFormAttributes.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormAttributes.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formAttributesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormAttributes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const formAttributes = formAttributesSlice.reducer;

export const formDetailSlice = createSlice({
  name: 'formDetail',
  initialState: {},
  reducers: {
    reset() {
      return {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFormDetail.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormDetail.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formDetailObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const formDetail = formDetailSlice.reducer;

export const formIntegrationBlock = createSlice({
  name: 'formIntegrationBlock',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormIntegrationBlock.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormIntegrationBlock.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formIntegrationBlockObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormIntegrationBlock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const formIntegrationBlockById = createSlice({
  name: 'formIntegrationBlockById',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormIntegrationBlockById.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormIntegrationBlockById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formIntegrationBlockByIdObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormIntegrationBlockById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const formValidationBlock = createSlice({
  name: 'formValidationBlock',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormValidationBlock.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormValidationBlock.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formValidationBlockObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormValidationBlock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const formVisibilityBlock = createSlice({
  name: 'formVisibilityBlock',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormVisibilityBlock.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormVisibilityBlock.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formVisibilityBlockObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormVisibilityBlock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const formAttributeIntegrationConditionSlice = createSlice({
  name: 'formAttributeIntegrationCondition',
  initialState: {},
  reducers: {
    reset() {
      return {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFormAttributeIntegrationCondition.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormAttributeIntegrationCondition.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formAttributeIntegrationConditionObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormAttributeIntegrationCondition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const formAttributeIntegrationCondition = formAttributeIntegrationConditionSlice.reducer;

export const formAttributeIntegrationPayloadSlice = createSlice({
  name: 'formAttributeIntegrationPayload',
  initialState: {},
  reducers: {
    reset() {
      return {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFormAttributeIntegrationPayload.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormAttributeIntegrationPayload.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formAttributeIntegrationPayloadObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormAttributeIntegrationPayload.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const formAttributeIntegrationPayload = formAttributeIntegrationPayloadSlice.reducer;

export const formAttributeValidationConditionSlice = createSlice({
  name: 'formAttributeValidationCondition',
  initialState: {},
  reducers: {
    reset() {
      return {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFormAttributeValidationCondition.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormAttributeValidationCondition.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formAttributeValidationConditionObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormAttributeValidationCondition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const formAttributeValidationCondition = formAttributeValidationConditionSlice.reducer;

export const formAttributeVisibilityConditionSlice = createSlice({
  name: 'formAttributeVisibilityConditionSlice',
  initialState: {},
  reducers: {
    reset() {
      return {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFormAttributeVisibilityCondition.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormAttributeVisibilityCondition.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formAttributeVisibilityConditionObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormAttributeVisibilityCondition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const formAttributeVisibilityCondition = formAttributeVisibilityConditionSlice.reducer;

export const allMastersList = createSlice({
  name: 'allMastersList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMastersList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAllMastersList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allMastersListObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAllMastersList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const allMasters = createSlice({
  name: 'allMasters',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMasters.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAllMasters.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allMastersObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAllMasters.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const getLovs = createSlice({
  name: 'getLovs',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLov.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getLov.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allLovObject = payload.data;
      state.error = '';
    });
    builder.addCase(getLov.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.allLovObject = [];
    });
  }
}).reducer;

export const getRights = createSlice({
  name: 'getRights',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRightsFor.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRightsFor.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allRightsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRightsFor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const allMastersColumnList = createSlice({
  name: 'allMastersColumnList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMastersColumnList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAllMastersColumnList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allMastersColumnListObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAllMastersColumnList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const payloadParentDropdown = createSlice({
  name: 'payloadParentDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownPayloadParent.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownPayloadParent.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.payloadParentDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownPayloadParent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
