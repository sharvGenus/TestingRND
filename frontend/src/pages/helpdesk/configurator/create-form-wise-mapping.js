import { Button, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectTags, RHFSelectbox } from 'hook-form';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { getDropdownProjects, getFormData, getFormWiseTicketMapping, getLovsForMasterName } from 'store/actions';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';

const CreateFormWiseMapping = ({ editRow, onBack }) => {
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const { forms } = useDefaultFormAttributes();
  const formsList = forms?.formDataObject?.rows || [];

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  useEffect(() => {
    dispatch(getLovsForMasterName('FORM_TYPES'));
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        formTypeId: Validations.other,
        formId: Validations.other,
        searchFields: Validations.otherArray,
        displayFields: Validations.otherArray,
        mobileFields: Validations.otherArray
      })
    ),
    defaultValues: {
      projectId: editRow?.projectId || '',
      formTypeId: editRow?.formTypeId || '',
      formId: editRow?.formId || '',
      searchFields: editRow?.searchFields?.map((field) => field.id) || [],
      displayFields: editRow?.displayFields?.map((field) => field.id) || [],
      mobileFields: editRow?.mobileFields?.map((field) => field.id) || [],
      geoLocationField: editRow?.geoLocationField?.id || ''
    },
    mode: 'all'
  });

  const onGetFormDataHandler = useCallback(
    (projectId, typeId) => {
      if (!firstRender.current) {
        methods.setValue('formId', '');
      }
      firstRender.current = false;
      dispatch(getFormData({ projectId, typeId }));
    },
    [dispatch, methods]
  );

  const projectIdWatch = methods.watch('projectId');
  const typeIdWatch = methods.watch('formTypeId');
  useEffect(() => {
    onGetFormDataHandler(projectIdWatch, typeIdWatch);
  }, [projectIdWatch, typeIdWatch, onGetFormDataHandler]);

  const onSubmitHandler = async (payload) => {
    if (payload.geoLocationField === '') payload.geoLocationField = null;
    const response = await request(editRow ? '/update-form-wise-ticket-mapping' : '/form-wise-ticket-mapping-create', {
      method: editRow ? 'PUT' : 'POST',
      params: editRow?.id || null,
      body: payload
    });
    if (response.success) {
      toast(`Form wise ticket mapping ${editRow ? 'updated' : 'created'} successfully`, { variant: 'success', autoHideDuration: 10000 });
      dispatch(getFormWiseTicketMapping());
      onBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const { handleSubmit } = methods;

  const formId = methods.watch('formId');
  useEffect(() => {
    if (!editRow || (editRow && formId !== editRow.formId)) {
      methods.setValue('displayFields', []);
      methods.setValue('searchFields', []);
      methods.setValue('mobileFields', []);
      methods.setValue('geoLocationField', '');
    }
  }, [formId, editRow, methods]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
      <MainCard sx={{ mb: 2 }}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item xl={4} xs={12}>
            <RHFSelectbox
              name={'projectId'}
              label={'Project'}
              InputLabelProps={{ shrink: true }}
              menus={projectData}
              allowClear
              required
              disable={false || !!editRow}
            />
          </Grid>
          <Grid item xl={4} xs={12}>
            <RHFSelectbox
              name={'formTypeId'}
              label={'Form Type'}
              InputLabelProps={{ shrink: true }}
              menus={methods.watch('projectId') ? formTypeData : []}
              allowClear
              required
              disable={false || !!editRow}
            />
          </Grid>
          <Grid item xl={4} xs={12}>
            <RHFSelectbox
              name={'formId'}
              label={'Form'}
              InputLabelProps={{ shrink: true }}
              menus={methods.watch('projectId') && methods.watch('formTypeId') ? formsList : []}
              allowClear
              required
              disable={false || !!editRow}
            />
          </Grid>
          <Grid item xs={12}>
            <RHFSelectTags
              name={'searchFields'}
              label={'Search Fields'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == methods.watch('formId');
                  })[0]
                  ?.form_attributes?.map((item) => ({ name: item.name, id: item.id })) || []
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <RHFSelectTags
              name={'displayFields'}
              label={'Display Fields'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == methods.watch('formId');
                  })[0]
                  ?.form_attributes?.map((item) => ({ name: item.name, id: item.id })) || []
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <RHFSelectTags
              name={'mobileFields'}
              label={'Mobile Display Fields'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == methods.watch('formId');
                  })[0]
                  ?.form_attributes?.map((item) => ({ name: item.name, id: item.id })) || []
              }
              required
            />
          </Grid>
          <Grid item xl={4} xs={12}>
            <RHFSelectbox
              name={'geoLocationField'}
              label={'Geo Location Field'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == methods.watch('formId');
                  })[0]
                  ?.form_attributes?.filter((item) => item.default_attribute?.inputType === 'location')
                  .map((item) => ({ name: item.name, id: item.id })) || []
              }
              allowClear
            />
          </Grid>
          <Grid item xs={12} textAlign={'right'} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem' }}>
            <Button variant="outlined" size="small" color="primary" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" size="small" color="primary" type="submit">
              {editRow ? 'Update' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </MainCard>
    </FormProvider>
  );
};

CreateFormWiseMapping.propTypes = {
  editRow: PropTypes.any,
  onBack: PropTypes.func
};

export default CreateFormWiseMapping;
